<template>
  <div v-show="list" class="todo-list z-depth-2">
    <h2 class="name">
      {{ list.name }}
    </h2>
      <progress-bar v-if="list.items" :items="list.items"/>
      <list-item
        v-for="item in listItems"
        :key="item._id"
        :item-data="item"
        @mousedown="(e) => mouseDownItem(item._id, e)"
      />
    <div class="buttons flex between">
      <button class="btn-floating btn-large waves-effect waves-light red lighten-3">
        <i class="material-icons">security</i>
      </button>
      <button @click="addItem"
      class="btn-floating btn-large waves-effect waves-light red lighten-3">
        <i class="material-icons">add</i>
      </button>
      <button class="btn-floating btn-large waves-effect waves-light red lighten-3">
        <i class="material-icons">delete_forever</i>
      </button>
    </div>
  </div>
</template>
<script>
import {
  watch,
  watchEffect,
  ref,
  onMounted,
  computed,
} from 'vue';

import { useStore } from '@/store';
import progressBar from '@/components/list/ProgressBar.vue';
import listItem from '@/components/list/ListItem.vue';
import { actions } from '@/types';
import useMousePosition from '@/composition/useMousePosition';
import { onNoMouseUp } from '@/helpers';

function useDraggableOrder(itemsProp) {
  const { dispatch } = useStore();

  const items = ref(itemsProp);

  // The currently dragging element
  const dragging = ref(false);

  // Access with item._id to get the DOM element
  let itemIdToElMap = {};
  onMounted(() => {
    // Keep itemIdToElMap up to date when items changes by adding or removing items for example
    watchEffect(() => {
      itemIdToElMap = {};
      items.value.forEach((item) => {
        itemIdToElMap[item._id] = document.querySelector(`[data-id="${item._id}"]`);
      });
    });
  });

  // Reactive mouse position
  const {
    x,
    y,
    listen,
    stopListen,
  } = useMousePosition();

  // Watch mouse position and update the ui according to the current position of the dragging item
  watch([x, y], ([newX, newY]) => {
    itemIdToElMap[dragging.value].style.left = `${newX}px`;
    itemIdToElMap[dragging.value].style.top = `${newY}px`;

    // Calculate the closest element to the current position of the mouse (dragging element)
    const closest = items.value.reduce((aggr, curr) => {
      // Don't check the dragging element
      if (curr._id === dragging.value) return aggr;

      // Remove classes here instead of looping again after this
      itemIdToElMap[curr._id].classList.remove('dragging-bottom', 'dragging-top');

      // If it is the first iteration
      if (!aggr) return curr;

      const offsetWithAggr = Math.abs(itemIdToElMap[aggr._id].offsetTop - y.value);
      const offsetWithCurr = Math.abs(itemIdToElMap[curr._id].offsetTop - y.value);
      return (offsetWithAggr > offsetWithCurr) ? curr : aggr;
    }, null);

    // Add class to show position of dragging element if it where to be dropped
    const topOrBottomClass = ((itemIdToElMap[closest._id].offsetTop - y.value) < 0) ? 'dragging-bottom' : 'dragging-top';
    itemIdToElMap[closest._id].classList.add(topOrBottomClass);
  });

  /**
   * Start the dragging of an item
   */
  function onStartDrag(itemId) {
    // Start listening for mouse movement
    listen();

    // Insert a clone to replace the element while dragging
    const clone = itemIdToElMap[itemId].cloneNode(true);
    clone.classList.add('dragging-clone');
    itemIdToElMap[itemId].parentNode.insertBefore(clone, itemIdToElMap[itemId]);

    // Add dragging class to the dragging element
    itemIdToElMap[itemId].classList.add('dragging');
  }

  /**
   * Reset the list from all dragging styles and save the new list order
   */
  function onEndDrag(itemId) {
    // Can stop listening for mousemove events because no dragging is happening
    stopListen();

    // Save the final order of the items
    items.value = reOrder(items.value);

    // No longer dragging so remove the class
    itemIdToElMap[itemId].classList.remove('dragging');

    // Remove all dragging-clones that we find
    document.querySelectorAll('.dragging-clone').forEach((node) => node.parentElement.removeChild(node));

    // Remove dragging-top and dragging-bottom of any items that got it
    document.querySelectorAll('.dragging-bottom, .dragging-top').forEach((el) => { el.classList.remove('dragging-bottom', 'dragging-top'); });
  }

  /**
   * Start or stop dragging an item
   */
  watch(dragging, (newDragging, oldDragging) => {
    if (newDragging) {
      onStartDrag(newDragging);
    }

    if (oldDragging) {
      onEndDrag(oldDragging);
    }
  });

  /**
   * Sorts the items by their offset and assigns the right order to them
   */
  function reOrder(toOrder) {
    toOrder.sort((a, b) => itemIdToElMap[a._id].offsetTop - itemIdToElMap[b._id].offsetTop);
    toOrder.forEach((item, i) => {
      // If the order is already fine, return
      if (item.order === i) return;

      item.order = i;

      // Update the order on the server and other clients
      // TODO: Method to update the whole list, instead of multiple listitem requests
      dispatch(actions.PATCH_ITEM, {
        id: item._id,
        patchData: {
          order: item.order,
        },
      });
    });
    return toOrder;
  }

  // Called in template on clicking an item and sets everything in motion
  function mouseDownItem(itemId) {
    // Start the drag on holding for 200 millis
    onNoMouseUp(200, () => {
      dragging.value = itemId;

      // Stop the drag on mouse up
      function mouseUp() {
        dragging.value = false;
        document.removeEventListener('mouseup', mouseUp);
      }
      document.addEventListener('mouseup', mouseUp);
    });
  }

  const listItems = computed(() => items.value.sort((a, b) => a.order - b.order));
  return { listItems, mouseDownItem };
}

export default {
  components: {
    progressBar,
    listItem,
  },
  props: {
    list: {
      required: true,
    },
  },
  setup(props) {
    const { dispatch } = useStore();

    function addItem() {
      dispatch(actions.ADD_ITEM_TO_LIST, props.list._id);
    }

    // Set up for the draggable reordering of items
    const items = ref(props.list.items);
    const { listItems, mouseDownItem } = useDraggableOrder(items);

    return {
      addItem,
      listItems,
      mouseDownItem,
    };
  },
};

</script>
<style lang="scss" scoped>
.todo-list {
  max-width: 400px;
  padding-bottom: 1.5rem;
  background: linear-gradient(50deg, #2196f3, #3f51b5);
  user-select: none;
}

.name {
  margin: 0 1.5rem;
  padding: 1.5rem 0 .5rem 0;
  font-size: 2.5rem;
  text-transform: uppercase;
  color: #EF9A9A;
}

.buttons {
  margin: auto 1.5rem;
}

.dragging {
  position: fixed;
}

.dragging-clone {
  opacity: 0.5;
}

.dragging-bottom, .dragging-top {
  position: relative;
}

.dragging-bottom::after, .dragging-top::before {
  content: '';
  display: block;
  background: rgba(239, 154, 154, 0.5);
  width: 90%;
  left: 5%;
  height: 4px;
  position: absolute;
}

.dragging-bottom::after {
  bottom: -13px;
}

.dragging-top::before {
  top: -13px;
}
</style>
