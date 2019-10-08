<template>
  <div
    @click="toggleLabel"
    class="label"
    :style="{ backgroundColor: labelColor, color: textColor }">
    <transition name="label-anim">
      <div v-show="labelExpanded" class="label-text-wrapper"
      :style="{ backgroundColor: labelColor }">
        <p class="label-text truncate">{{ labelText }}</p>
      </div>
    </transition>
  </div>
</template>
<script>
import { ref, computed } from '@vue/composition-api';

export default {
  props: {
    labelColor: String,
    labelText: String,
  },
  setup(props) {
    const labelExpanded = ref(false);

    const textColor = computed(() => {
      let calculationColor = props.labelColor;
      // Variables for red, green, blue values
      let r;
      let g;
      let b;

      // Check the format of the color, HEX or RGB?
      if (calculationColor.match(/^rgb/)) {
        // If HEX --> store the red, green, blue values in separate variables
        [, r, g, b] = calculationColor.match(
          /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/,
        );
      } else {
        // If RGB --> Convert it to HEX: http://gist.github.com/983661
        calculationColor = +`0x${calculationColor
          .slice(1)
          .replace(calculationColor.length < 5 && /./g, '$&$&')}`;

        /* eslint-disable no-bitwise, no-mixed-operators */
        r = calculationColor >> 16;
        g = (calculationColor >> 8) & 255;
        b = calculationColor & 255;
        /* eslint-enable no-bitwise, no-mixed-operators */
      }

      // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
      const hsp = Math.sqrt(
        0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b),
      );

      // Return color based on hsp value
      return hsp > 127.5 ? '#141414' : '#fafafa';
    });


    function toggleLabel() {
      labelExpanded.value = !labelExpanded.value;
    }

    return {
      color: props.labelColor,
      label: props.labelText,
      labelExpanded,
      toggleLabel,
      textColor,
    };
  },
};
</script>
<style lang="scss" scoped>
.label {
  position: relative;
  min-width: 5px;
}

.label-text-wrapper {
  min-width: 2rem;
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center;
}

.label-text {
  writing-mode: sideways-lr;
  margin: 0;
}

.label-anim-enter-active,
.label-anim-leave-active {
  transition: all 0.2s ease;
  z-index: 3;
}

.label-anim-enter,
.label-anim-leave-to {
  transform: translateX(-50%) scaleX(0);
}
</style>
