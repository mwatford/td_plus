<template>
  <nav class="navigation">
    <button class="button">as</button>
    <!-- <button @click="$store.commit('user/RESET_STATE')">as</button> -->
  </nav>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.navigation {
  display: flex;
  height: 100vh;
  width: 45px;
  border-right: 1px solid #fff;
  background: linear-gradient(90deg, #000, #181818);
}
.button {
  cursor: pointer;
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  border: none;
  border-bottom: 1px solid #838383;
  color: #fff;
  margin: 0;
  padding: 0;

  &:hover {
    background: #ffffff22;
  }
}
</style>
