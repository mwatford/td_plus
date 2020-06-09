<template>
  <ul class="list">
    <li v-if="header" class="list__header row">
      <h3 class="text text--center">{{ header }}</h3>
    </li>
    <li v-for="(item, index) in items" :key="index" class="list__item">
      <slot :item="item"></slot>
    </li>
    <li v-if="items.length < limit" class="list__item">
      <slot name="list-action"></slot>
    </li>
  </ul>
</template>

<script>
import { mapState } from 'vuex';

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
  methods: {
    addList() {},
    deleteList() {},
    changeListName() {},
  },
};
</script>

<style lang="scss">
.list {
  margin-left: 3px;
  list-style-type: none;

  &__item,
  &__header {
    display: flex;
    background: #000000cc;
    border-radius: 2px;
    color: #fff;
    margin-bottom: 3px;
    width: 250px;
    height: 43px;
    overflow: hidden;

    &--red {
      background: red;
    }

    .text {
      display: flex;
      align-items: center;
      padding: 0 12px;
      width: 100%;
      height: 100%;

      &--center {
        justify-content: center;
      }
    }
  }
  // .text,
  // li.add {
  //   &:hover {
  //     background: #000000da;
  //   }
  // }
}
</style>
