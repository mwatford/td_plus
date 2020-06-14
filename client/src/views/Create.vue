<template>
  <div class="create row">
    <form @submit.prevent class="box" ref="create-form">
      <div class="col">
        <input
          type="text"
          name="name"
          ref="name"
          placeholder="project name"
          v-model="name"
          class="input"
          required
        />
        <input
          v-if="auth"
          type="password"
          ref="password"
          class="input"
          name="invite"
          v-model="password"
          placeholder="password (optional)"
        />
        <BaseSelect
          ref="template-picker"
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
          ref="submit"
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
import boxAnimations from 'Mixins/boxAnimations';
import { hashPassword } from 'Utils/password';
import navigate from 'Mixins/navigate';
import factory from 'Classes/ProjectFactory';
import { manageProject } from 'Services/LocalDbManager';
import http from 'Services/api/index';

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
      return (
        Object.keys(factory.templates).map(el => ({
          value: el,
          text: el,
        })) || []
      );
    },
  },
  methods: {
    async create() {
      try {
        await this.validate();

        const password = this.password ? await hashPassword(this.password) : '';
        this.project = factory.create(this.type, { name: this.name, password });

        if (this.auth) {
          await http.projects.create(this.token, this.project);
          await this.updateUser();
        } else {
          manageProject('add', this.project);
        }

        this.alert('success', 'Project created');
        this.navigate({ name: 'home' });
      } catch (e) {
        this.alert('error', e || 'Something went wrong');
      }
    },
    async validate() {
      if (!this.name || !this.type) return Promise.reject();
      return Promise.resolve();
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
