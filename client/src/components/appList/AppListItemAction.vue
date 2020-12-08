<template>
  <div class="icon row" title="delete list">
    <slot></slot>
    <app-icon type="cross" size="14" class="m-auto"></app-icon>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.icon {
  border: none;
  background: transparent;
  height: 100%;
  width: 43px;
  cursor: pointer;

  &:hover {
    background: #ff3131b4;
  }
}
</style>
