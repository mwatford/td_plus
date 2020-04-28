<template>
  <div class="create row">
    <form @submit.prevent class="box">
      <div class="col">
        <input
          type="text"
          name="name"
          placeholder="project name"
          v-model="project.name"
          class="input"
        />
        <input
          v-if="auth"
          type="password"
          class="input"
          name="invite"
          v-model="password"
          placeholder="password (optional)"
        />
      </div>
      <div class="row">
        <input
          type="submit"
          class="button m-auto"
          @click.prevent="create"
          value="Create"
        />
        <button class="button m-auto" @click.prevent="navigate(-1)">
          Back
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import boxAnimations from '../mixins/boxAnimations';
import { hashPassword } from '../utils/password';
import navigate from '../mixins/navigate';

export default {
  mixins: [boxAnimations, navigate],
  data() {
    return {
      password: '',
      project: this.createEmptyProject(),
    };
  },
  computed: {
    ...mapState({
      user: state => state.user,
      token: state => state.auth.token,
      auth: state => state.auth.status,
    }),
  },
  methods: {
    hashPassword,
    createEmptyProject() {
      return {
        name: '',
        password: '',
        members: [],
        lists: [
          { name: 'To Do', data: [] },
          { name: 'In Progress', data: [] },
          { name: 'Done', data: [] },
        ],
      };
    },
    async create() {
      try {
        await this.createPassword();
        await this.saveProject();
        await this.updateUser();
        this.navigate({ name: 'home' });
      } catch (e) {
        this.navigate({ name: 'home' });
      }
    },
    async createPassword() {
      if (this.password) {
        this.project.password = await this.hashPassword(this.password);
      }
    },
    saveProject() {
      return this.auth ? this.request() : this.saveLocally();
    },
    request() {
      return this.$http({
        method: 'post',
        url: '/api/projects/create',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        data: {
          project: this.project,
        },
      });
    },
    saveLocally() {
      let projects = window.localStorage.getItem('projects');

      if (projects) {
        projects = JSON.parse(projects);
      } else {
        projects = [];
      }

      if (projects.find(el => el.name === this.project.name)) {
        this.project.name = prompt(
          `You already have a project with given name,
           please provide a different name: `
        );
        return this.project.name ? this.saveLocally() : Promise.reject();
      }

      projects.push(this.project);
      projects = JSON.stringify(projects);
      window.localStorage.setItem('projects', projects);
    },
    updateUser() {
      if (this.auth) {
        return this.$store.dispatch('user/fetchUser', {
          token: this.token,
          email: this.user.email,
        });
      }
    },
  },
  mounted() {
    this.boxEnterAnimation(300, 0, false);
  },
  beforeRouteLeave(to, from, next) {
    this.boxExitAnimation(300, 0, false).then(next);
  },
};
</script>

<style lang="scss" scoped>
.create {
  display: flex;
  justify-content: center;
  align-items: center;
}
.box {
  position: relative;
  min-height: 400px;
  justify-content: space-between;
  padding: 50px;

  h2 {
    margin-bottom: 2px;
  }
}
</style>
