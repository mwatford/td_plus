<template>
  <select v-model="selected" @change="handleChange" ref="select">
    <option disabled :selected="!selected">{{ placeholder }}</option>
    <option
      v-for="item in options"
      :key="item.text"
      ref="option"
      :value="item.value"
    >
      {{ item.text }}
    </option>
  </select>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true,
      default: () => [],
      validator: data =>
        data.every(
          el => el.hasOwnProperty('text') && el.hasOwnProperty('value')
        ),
    },
    placeholder: {
      type: String,
      required: false,
      default: 'select',
    },
  },
  data: () => ({
    selected: null,
  }),
  methods: {
    handleChange() {
      this.$emit('change', this.selected)
    },
  },
}
</script>

<style></style>
