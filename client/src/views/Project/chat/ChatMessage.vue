<template>
  <li :class="['message col', { 'message--right': isUser }]">
    <h4>{{ author }}</h4>
    <p>{{ text }}</p>
  </li>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
      default: '',
    },
    author: {
      type: String,
      required: true,
      default: '',
    },
    isUser: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.message {
  word-wrap: break-word;
  width: 70%;
  font-size: 16px;
  border-radius: 12px;
  padding: 5px 15px;
  color: #000;
  margin-bottom: 5px;
  background: #ffffffd2;

  h4 {
    font-size: 12px;
    font-style: italic;
  }

  p {
    width: 100%;
    text-align: left;
  }

  &--right {
    background: #6aff76d2;
    align-items: flex-end;
    margin-left: auto;

    p {
      text-align: right;
    }
  }
}
</style>
