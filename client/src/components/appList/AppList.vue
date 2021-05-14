<template>
  <ul class="list">
    <li v-if="header" class="list__item header row">
      <h3 class="text text--center">{{ header }}</h3>
    </li>
    <li v-for="(item, index) in items" :key="index" class="list__item">
      <slot :item="item" :index="index"></slot>
    </li>
    <li v-if="isBelowLimit" class="list__item">
      <slot name="list-action"></slot>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    limit: {
      type: Number,
    },
    header: {
      type: String,
    },
  },
  computed: {
    isBelowLimit() {
      return this.limit && this.items.length < this.limit
    },
  },
  methods: {},
}
</script>

<style lang="scss">
.list {
  margin-right: 3px;
  list-style-type: none;

  &__item {
    display: flex;
    background: #000000cc;
    border-radius: 2px;
    color: #fff;
    width: 250px;
    height: 43px;
    overflow: hidden;
    margin-top: 3px;
  }

  .text {
    display: flex;
    align-items: center;
    padding: 0 12px;
    width: 100%;
    height: 100%;
    cursor: pointer;

    &:hover {
      background: #000000da;
    }

    &--center {
      justify-content: center;
    }
  }
}
.header {
  margin-top: 0;

  .text:hover {
    cursor: initial;
    background: initial;
  }
}
</style>
