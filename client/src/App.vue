<template>
  <div id="app">
    asd
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
body {
  overflow: hidden;
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(#829e34, #852d52, #254a81);
  background-size: 400% 400%;
  animation: Gradient 20s ease-in-out infinite;
}

@keyframes Gradient {
  0% {
    background-position: 50% 10%;
  }
  25% {
    background-position: 90% 50%;
  }
  50% {
    background-position: 50% 90%;
  }
  75% {
    background-position: 10% 50%;
  }
  100% {
    background-position: 50% 10%;
  }
}
</style>
