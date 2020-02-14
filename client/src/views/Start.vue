<template>
  <div class="start row">
    <section>
      <Login></Login>
    </section>
    <section class="register ">
      <Register></Register>
    </section>
  </div>
</template>

<script>
import Login from "../components/sign-in.vue";
import Register from "../components/register.vue";

export default {
  data() {
    return {};
  },
  components: {
    Login,
    Register
  }
};
</script>

<style lang="scss">
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.start {
  width: 100%;
  height: 100%;
  position: relative;
}
.form {
  min-width: 350px;
  height: 400px;
  display: flex;
  flex-direction: column;
  background: #000000cc;
  color: #fff;
  justify-content: space-between;
  padding: 50px 50px;

  &--inverted {
    background: #fff;
    color: #000;

    & .input {
      color: #000;
      background: #fff;
      border-color: #000;
    }
  }

  &__link {
    color: #fff;
    margin: 20px auto;
    // height: 30px;
  }
}
section {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  &.register {
    background: #000000cc;
  }
}
.header {
  margin-bottom: 20px;
}
.input {
  height: 30px;
  width: 100%;
  margin: 10px 0px;
  border: none;
  background: none;
  color: #fff;
  border-bottom: 2px solid #fff;
  padding: 2px;
}
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  font-size: 18px;
  font-family: Ubuntu;
  margin: 10px auto 0 auto;
  height: 40px;
  border-radius: 20px;
  border: 2px solid #fff;
  background-color: transparent;
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: #fff;
    color: #000;
  }

  &--inverted {
    border-color: #000;
    color: #000;

    &:hover {
      background-color: #000;
      color: #fff;
    }
  }
}
</style>
