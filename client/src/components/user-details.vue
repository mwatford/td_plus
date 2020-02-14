<template>
  <div class="userDetails col">
    <h3>{{ user.name ? user.name : "Not Set" }}</h3>
    <h4>{{ user.email }}</h4>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      required: true,
      type: Object
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.userDetails {
  color: #fff;
  position: absolute;
  width: 280px;
  height: 300px;
  top: 0;
  left: 100%;
  margin: 20px;
  background: #000000;
  box-shadow: 0 0 15px 2px #0000006e;
  padding: 20px 0 0 20px;
}
</style>
