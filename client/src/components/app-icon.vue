<template>
  <svg
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:cc="http://creativecommons.org/ns#"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:svg="http://www.w3.org/2000/svg"
    xmlns="http://www.w3.org/2000/svg"
    xml:space="preserve"
    viewBox="0 0 16 16"
    :fill="color"
    :style="iconStyle"
  >
    <component :is="type"></component>
  </svg>
</template>

<script>
import icons from './icons/index'

export default {
  components: {
    ...icons,
  },
  props: {
    type: {
      type: String,
    },
    color: {
      type: String,
      default: '#fff',
    },
    size: {
      type: [Number, String],
      default: 16,
    },
  },
  computed: {
    iconStyle() {
      const { size } = this
      return {
        width: `${size}px`,
        height: `${size}px`,
      }
    },
  },
}
</script>

<style></style>
