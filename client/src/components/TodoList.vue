<template>
  <div v-show="state.list" class="todo-list z-depth-2">
    <h2 class="name">
      {{ state.list.name }}
    </h2>
    <draggable v-model="state.list.items">
      <transition-group type="transition" :name="'flip-list'">
        <div v-for="item in state.list.items" :key="item.id"
        class="section z-depth-2 todolist-item"
        @click="toggleLabel(item, $event)">
          <div class="label-color"
          :style="{ backgroundColor: item.color }"
          ></div>
          <transition name="label-anim">
            <div v-show="item.labelExpanded" class="label-text-wrapper"
            :style="{ backgroundColor: item.color, color: lightOrDark(item.color) }">
              <div class="label-text truncate">
                {{ item.label }}
              </div>
            </div>
          </transition>
          <div class="todolist-item-body">
            <div class="todolist-item-name">
              {{ item.name }}
            </div>
            <div class="todolist-item-description">
              {{ endAt(item.description, 150) }}
            </div>
          </div>
          <div class="checkbox-wrapper">
            <label>
            <input type="checkbox" class="filled-in" :checked="item.done"
              @click="item.done = !item.done" />
              <!-- This span is required -->
              <span class="checkbox-span"></span>
              </label>
          </div>
        </div>
      </transition-group>
    </draggable>
  </div>
</template>
<script>
import { reactive } from '@vue/composition-api';
import draggable from 'vuedraggable';

export default {
  components: {
    draggable,
  },
  setup() {
    const state = reactive({
      list: {
        name: 'Todo list 1',
        author: 'laytan1@hotmail.com',
        items: [
          {
            order: 1,
            id: 'asdasd',
            name: 'Buy Groceries',
            label: 'Dashboard bugs',
            description: 'Lorem ipsum dolor sit amet',
            labelExpanded: false,
            color: 'rgba(255,0,0,1)',
            editedAt: Date.now(),
            done: false,
            author: 'laytanlaats@hotmail.com',
          },
          {
            order: 3,
            id: 'asdasxcxcd',
            name: 'Fix bugs',
            label: 'low prio',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
            + ' Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s,'
            + ' when an unknown printer took a galley of type and scrambled it to make a type specimen book.'
            + ' It has survived not only five centuries, but also the leap into electronic typesetting,'
            + ' remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset'
            + ' sheets containing Lorem Ipsum passages, and more recently with desktop publishing software'
            + ' like Aldus PageMaker including versions of Lorem Ipsum',
            labelExpanded: false,
            color: 'rgba(0,255,0,1)',
            editedAt: Date.now(),
            done: false,
            author: 'laytanlaats@hotmail.com',
          },
          {
            order: 2,
            id: 'asdasasdd',
            name: 'brush your theeth',
            label: 'maybe',
            description: 'Lorem ipsum dolor sit amet',
            labelExpanded: false,
            color: 'rgba(0,0,255,1)',
            editedAt: Date.now(),
            done: true,
            author: 'laytanlaats@hotmail.com',
          },
        ],
      },
    });

    function endAt(text, length) {
      return text.length > length ? `${text.substring(0, length)}...` : text;
    }

    function lightOrDark(color) {
      let calculationColor = color;
      // Variables for red, green, blue values
      let r; let g; let b;

      // Check the format of the color, HEX or RGB?
      if (calculationColor.match(/^rgb/)) {
        // If HEX --> store the red, green, blue values in separate variables
        [, r, g, b] = calculationColor.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
      } else {
        // If RGB --> Convert it to HEX: http://gist.github.com/983661
        calculationColor = +(`0x${calculationColor.slice(1).replace(
          calculationColor.length < 5 && /./g, '$&$&',
        )}`);

        /* eslint-disable no-bitwise, no-mixed-operators */
        r = calculationColor >> 16;
        g = calculationColor >> 8 & 255;
        b = calculationColor & 255;
        /* eslint-enable no-bitwise, no-mixed-operators */
      }

      // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
      const hsp = Math.sqrt(
        0.299 * (r * r)
        + 0.587 * (g * g)
        + 0.114 * (b * b),
      );

      // Return color based on hsp value
      return hsp > 127.5 ? '#141414' : '#fafafa';
    }

    function toggleLabel(item, e) {
      /* eslint-disable no-param-reassign */
      item.labelExpanded = !item.labelExpanded;
      /* eslint-enable no-param-reassign */
      if (!item.labelExpanded) {
        return;
      }
      const listItem = window.$(e.target).closest('.todolist-item');
      const label = listItem.find('.label-text');
      label.css('max-height', listItem.height());
    }

    return {
      state,
      lightOrDark,
      endAt,
      toggleLabel,
    };
  },
};
</script>
<style lang="scss" scoped>
.todo-list {
  max-width: 400px;
  padding-bottom: 1.5rem;
  background: linear-gradient(50deg, #2196f3, #3f51b5);
}

.name {
  margin: 0 1.5rem;
  padding: 1.5rem 0 .5rem 0;
  font-size: 2.5rem;
  text-transform: uppercase;
  border-bottom: 3px solid #00E676;
  color: #EF9A9A;
}

.todolist-item {
  display: flex;
  padding: 0;
  margin: 1.5rem;
  background: rgba(255,255,255,0.85);

  > div {
    padding: 1rem 0;
  }
}

.label-color {
  width: 5px;
}

.label-text-wrapper {
  padding-top: 5px !important;
  padding-bottom: 5px !important;
  width: 2rem;
}

.label-text {
  writing-mode: sideways-lr;
  max-height: 100%;
  text-overflow: unset;
}

.checkbox-wrapper {
  margin-left: auto;
}

.todolist-item-body {
  margin-left: 1rem;
  flex-shrink: 100;
}

.todolist-item-name {
  font-weight: bold;
  margin-bottom: .4rem;
}

.todolist-item-description {
  font-size: 95%;
  text-align:justify;
  margin-right:1rem;
}

.label-anim-enter-active, .label-anim-leave-active {
  transition: all .2s ease;
  z-index: 3;
}

.label-anim-enter, .label-anim-leave-to {
  transform: translateX(-50%) scaleX(0);
}

.flip-list-move {
  transition: transform .2s;
}
</style>
