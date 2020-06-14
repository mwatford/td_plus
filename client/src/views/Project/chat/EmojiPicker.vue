<template>
  <div
    :class="['emojiPicker', { 'emojiPicker--open': isExpanded }]"
    @click="isExpanded = !isExpanded"
  >
    <div>
      &#x1F604;
    </div>
    <ul class="emojiList" v-if="isExpanded">
      <li
        class="emojiList__element"
        v-for="el in emojis"
        :key="el"
        @click="onEmojiClick(el)"
      >
        {{ String.fromCodePoint(el) }}
      </li>
    </ul>
  </div>
</template>

<script>
import emojis from '../../../utils/emojiList';

export default {
  data: () => ({ emojis, isExpanded: false }),
  methods: {
    onEmojiClick(el) {
      this.$emit('chosen', el);
    },
  },
};
</script>

<style lang="scss" scoped>
.emojiPicker {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 30px;
  width: 30px;
  margin: auto;
  margin-bottom: 0;
  border-radius: 2px;
  cursor: pointer;

  &:hover,
  &--open {
    background: #0000008e;
  }
}
.emojiList {
  justify-content: flex-start;
  align-items: flex-start;
  position: absolute;
  bottom: 50%;
  right: 50%;
  display: flex;
  flex-wrap: wrap;
  width: 250px;
  background: #fff;
  list-style-type: none;
  padding: 5px;
  border-radius: 4px;

  &__element {
    cursor: pointer;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;

    &:hover {
      background: #c0c0c0;
    }
  }
}
</style>
