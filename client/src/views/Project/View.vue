<template>
  <div class="col wrapper m-auto">
    <div class="row controls">
      <div class="row">
        <button
          v-if="auth"
          :disabled="!buttonsActive"
          :class="[`button button--start`, { 'button--active': filter }]"
          @click="toggleFilter"
        >
          Filter
        </button>
        <button
          v-if="auth"
          :disabled="!buttonsActive"
          :class="[`button`, { 'button--active': chat }]"
          @click="toggleChat"
        >
          Chat
        </button>
      </div>
      <div class="row">
        <button
          :class="[
            `button button--start`,
            { 'button--active': currentView === 'dashboard' },
          ]"
          :disabled="!buttonsActive"
          @click="changeView('dashboard')"
        >
          Dashboard
        </button>
        <button
          :class="[
            `button`,
            'button--end',
            { 'button--active': currentView === 'manage' },
          ]"
          :disabled="!buttonsActive"
          @click="changeView('manage')"
          v-if="isAdmin"
        >
          Manage
        </button>
      </div>
    </div>
    <div class="row">
      <Chat v-if="chat"></Chat>
      <Project></Project>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import navigate from 'Mixins/navigate';
import Project from './Project.vue';
import Chat from './chat/Chat.vue';
import http from 'Services/api/index';
import socketController from './dependencies/socket-handlers';

export default {
  components: {
    Project,
    Chat,
  },
  mixins: [navigate],
  data() {
    return {
      buttonsActive: false,
      currentView: '',
      chat: false,
      data: null,
    };
  },
  computed: {
    ...mapState({
      user: state => state.user,
      token: state => state.auth.token,
      project: state => state.activeProject.data,
      auth: state => state.auth.status,
      filter: state => state.activeProject.filter,
    }),
    permissions() {
      return this.project.members.find(el => el.id == this.user._id)
        .permissions;
    },
    isAdmin() {
      return this.project && (this.project.admin === this.user._id || !this.auth);
    },
  },
  methods: {
    ...socketController,
    async fetchData() {
      try {
        await this.$store.dispatch('activeProject/fetchProject', {
          token: this.token,
          id: this.project._id,
        });
        await this.connect();

        this.activateButtons();
        this.toggleChat();
        this.changeView('dashboard');
      } catch (e) {
        this.alert('error', e || 'Cannot access this resource.');
        this.navigate('home');
      }
    },
    toggleChat() {
      this.chat = !this.chat;
    },
    changeView(view) {
      this.$eventBus.$emit('change-view', view);
      this.currentView = view;
    },
    activateButtons() {
      this.buttonsActive = true;
    },
    toggleFilter() {
      this.$store.commit('activeProject/FILTER');
    },
    async fetchDataHandler() {
      if (this.auth) {
        await this.fetchData();

        this.initListeners();
      } else {
        this.activateButtons();
        this.changeView('dashboard');
      }
    },
    updateProject(project) {
      this.$store.commit('activeProject/SET_PROJECT', project);
    },
  },
  created() {
    this.$eventBus.$on('fetch-data', this.fetchDataHandler);
    this.$eventBus.$on('project-updated', this.emitUpdate);
  },
  beforeMount() {
    if (!this.project) this.navigate({ name: 'home' });
  },
  beforeDestroy() {
    this.$eventBus.$off('fetch-data', this.fetchDataHandler);
    this.$eventBus.$off('project-updated', this.emitUpdate);
    this.$socket.close();
  },
  beforeRouteLeave(from, to, next) {
    this.$store.commit('activeProject/RESET_STATE');
    next();
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  width: 90%;
  padding: 20px;
}
.controls {
  width: 100%;
  margin-bottom: 20px;
  justify-content: space-between;
}
.button {
  margin: 0 2px;
  border: none;
  background: #000000a2;
  border-radius: 2px;

  &--start {
    margin-left: 0;
  }

  &--end {
    margin-right: 0;
  }

  &:hover,
  &--active {
    background: #000000d2;
    color: #fff;
  }

  &:disabled,
  &:disabled:hover {
    color: #fff;
    background: #616161cb;
  }

  &--error {
    background: #ff00008a;
    &:hover {
      background: #ff0000d2;
    }
  }
  &--success {
    background: #0080008a;
    &:hover {
      background: #008000d2;
    }
  }
  &--warning {
    background: #ffa6008a;
    &:hover {
      background: #ffa600d2;
    }
  }
}
</style>
