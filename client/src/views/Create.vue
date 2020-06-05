<template>
  <div class="create row">
    <form @submit.prevent class="box" ref="form">
      <div class="col">
        <input
          type="text"
          name="name"
          placeholder="project name"
          v-model="name"
          class="input"
          required
        />
        <input
          v-if="auth"
          type="password"
          class="input"
          name="invite"
          v-model="password"
          placeholder="password (optional)"
        />
        <BaseSelect
          :options="options"
          :placeholder="'Choose a template'"
          @change="v => (type = v)"
        ></BaseSelect>
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
import factory from '../classes/ProjectFactory';
import { manageProject } from '../services/LocalDbManager';

export default {
  mixins: [boxAnimations, navigate],
  data() {
    return {
      password: '',
      name: '',
      type: '',
      project: null,
    };
  },
  computed: {
    ...mapState({
      user: state => state.user,
      token: state => state.auth.token,
      auth: state => state.auth.status,
    }),
    options() {
      return Object.keys(factory.templates).map(el => ({
        value: el,
        text: el,
      }));
    },
  },
  methods: {
    async create() {
      try {
        await this.validate();

        const password = (await hashPassword(this.password)) || '';
        this.project = factory.create(this.type, { name: this.name, password });

        await this.saveProject();
        if (this.auth) await this.updateUser();

        this.navigate({ name: 'home' });
      } catch (e) {
        this.alert('error', e);
      }
    },
    async validate() {
      return this.name && this.type;
    },
    saveProject() {
      return this.auth ? this.request() : manageProject('add', this.project);
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
    updateUser() {
      return this.$store.dispatch('user/fetchUser', {
        token: this.token,
        email: this.user.email,
      });
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
