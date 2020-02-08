<template>
  <div class="userDetails">
    {{ user }}
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
.userDetails {
  color: #fff;
  position: absolute;
  width: 280px;
  height: 300px;
  top: 0;
  left: 100%;
  margin: 20px;
  background: #000000;
  border-radius: 16px;
  box-shadow: 0 0 15px 2px #0000006e;
}
</style>
