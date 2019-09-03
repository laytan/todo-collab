<template>
  <div v-show="state.list" class="todo-list z-depth-2">
    <h2 class="name">
      {{ state.list.name }}
    </h2>
    <draggable v-model="state.list.items">
      <transition-group type="transition" :name="'flip-list'">
        <div v-for="item in state.list.items" :key="item.id"
        class="section z-depth-2 item">
          <transition name="label-anim">
            <div v-if="item.labelExpanded" class="label"
            :style="{ backgroundColor: item.color, color: lightOrDark(item.color) }"
            @click="item.labelExpanded = false">
              {{ item.label }}
            </div>
          </transition>
          {{ /* eslint-disable max-len */ }}
          <div v-if="!item.labelExpanded" class="color"
          :style="{ background: `linear-gradient(to left top, #fff 0%, #fff 50%, ${item.color} 50%, ${item.color} 100%)` }"
          @click="item.labelExpanded = true"></div>
          {{ /* eslint-enable max-len */ }}
          <div class="item-body valign-wrapper">
            Buy Groceries
            Laytan1@hotmail.com
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
            label: 'neccesity',
            labelExpanded: true,
            color: 'rgba(255,0,0,1)',
            editedAt: Date.now(),
            done: false,
          },
          {
            order: 2,
            id: 'asdasxcxcd',
            name: 'Fix bugs',
            label: 'low prio',
            labelExpanded: false,
            color: 'rgba(0,255,0,1)',
            editedAt: Date.now(),
            done: false,
          },
          {
            order: 3,
            id: 'asdasasdd',
            name: 'brush your theeth',
            label: 'maybe',
            labelExpanded: true,
            color: 'rgba(0,0,255,1)',
            editedAt: Date.now(),
            done: true,
          },
        ],
      },
    });

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

    return {
      state,
      lightOrDark,
    };
  },
};
</script>
<style lang="scss" scoped>
.todo-list {
  max-width: 400px;
  padding-bottom: 1.5rem;

}

.item {
  padding: 0;
  height: 5rem;
  margin: 1rem 1.5rem;
}

.color {
  height: 1.5rem;
  width: 1.5rem;
  position: absolute;
}

.label {
  position: absolute;
  padding: .1rem 1rem;
  max-height: 1.5rem;
}

.item-body {
  height: 100%;
  margin-left: 2rem;
}

.label-anim-enter-active, .label-anim-leave-active {
  transition: all .2s ease;
  z-index: 3;
}

.label-anim-enter, .label-anim-leave-to {
  transform: translateX(-50%) scaleX(0);
}

.name {
  padding: 2rem;
}

.flip-list-move {
  transition: transform .2s;
}
</style>
