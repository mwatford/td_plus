<template>
  <div class="home">
    <div class="create" @click="create">
      <div>+</div>
    </div>
    <router-link
      v-for="project in projects"
      :key="project._id"
      :to="{ path: `/project/${project._id}` }"
    >
      <project
        :project="project"
        v-if="display"
        @click.native="setProject(project)"
      ></project>
    </router-link>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import project from "../components/project.vue";
import boxAnimations from "../mixins/boxAnimations";
import navigate from "../mixins/navigate";

export default {
  mixins: [boxAnimations, navigate],
  components: {
    project
  },
  data() {
    return {
      display: false
    };
  },
  computed: {
    ...mapState({
      user: state => state.user,
      projects: state => state.projects.data,
      token: state => state.auth.token
    }),
    animate() {
      return this.$refs["animate"];
    }
  },
  methods: {
    create() {
      this.$router.push("/create");
    },
    fetchProjects() {
      return this.$store
        .dispatch("projects/fetchProjects", {
          token: this.token,
          id: this.user._id
        })
        .catch(e => e);
    },
    setProject(project) {
      this.$store.commit('activeProject/SET_PROJECT', project)
    }
  },
  beforeUpdate() {
    this.display = true;
  },
  mounted() {
    this.$store.commit("auth/SET_STATUS", true);
    this.fetchProjects().then(() => {
      this.boxEnterAnimation(200, 50, true);
    });
  },
  beforeRouteLeave(to, from, next) {
    this.boxExitAnimation(500, 20, true).then(next);
  }
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
