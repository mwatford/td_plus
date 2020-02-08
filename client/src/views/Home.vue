<template>
  <div class="home">
    <div class="create" @click="create">
      <div>+</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import project from "../components/project.vue";

export default {
  components: {
    project
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({ user: state => state.user })
  },
  methods: {
    create() {
      this.$router.push("/create");
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.home {
  display: grid;
  justify-content: center;
  grid-gap: 40px;
  grid-template-columns: repeat(auto-fill, 250px);
  grid-auto-rows: 250px;
  padding: 40px;
}
.create {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  border-radius: 16px;
  border: 2px dashed #fff;

  div {
    font-size: 72px;
    height: 100px;
    width: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    display: flex;
    border-radius: 50%;
    border: 5px solid #fff;
    font-family: Arial, Helvetica, sans-serif;
  }
}
</style>
