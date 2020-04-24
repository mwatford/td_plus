<template>
  <div class="col wrapper m-auto">
    <div class="row controls">
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
          v-if="auth"
          :disabled="!buttonsActive"
          :class="[`button`, { 'button--active': filter }]"
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
            `button`,
            'button--end',
            { 'button--active': currentView === 'manage' },
          ]"
          :disabled="!buttonsActive"
          @click="changeView('manage')"
          v-if="project && (project.admin === user._id || !this.auth)"
        >
          Manage
        </button>
      </div>
    </div>
    <div class="row">
      <Project></Project>
      <Chat v-if="chat"></Chat>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import navigate from '../../mixins/navigate';
import Project from './Project.vue';
import Chat from './Chat.vue';

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
  },
  methods: {
    fetchData() {
      this.$store
        .dispatch('activeProject/fetchProject', {
          id: this.project._id,
          token: this.token,
        })
        .then(({ data }) => {
          this.$store.commit('activeProject/RESET_STATE');
          this.$store.commit('activeProject/SET_PROJECT', data);

          this.activateButtons();
          this.toggleChat();
          this.changeView('dashboard');
        })
        .catch(err => {
          this.alert('error', err.response.data);
          this.navigate('home');
        });
    },
    toggleChat() {
      this.chat = !this.chat;
    },
    changeView(view) {
      this.$eventBus.$emit('changeView', view);
      this.currentView = view;
    },
    activateButtons() {
      this.buttonsActive = true;
    },
    async connect() {
      return this.$socket.connect({
        query: {
          user: this.user._id,
          project: this.project._id,
        },
      });
    },
    toggleFilter() {
      this.$store.commit('activeProject/FILTER');
    },
    async fetchDataHandler() {
      if (this.auth) {
        await this.fetchData();

        await this.connect();

        // this.$socket.on('update', data => {
        //   this.updateProject(data);
        // });
      } else {
        this.activateButtons();
        this.changeView('dashboard');
      }
    },
    updateProject(data) {
      this.$store.commit('activeProject/UPDATE', data);
    },
  },
  created() {
    this.$eventBus.$on('fetch data', this.fetchDataHandler);
  },
  beforeMount() {
    if (!this.project) this.navigate({ name: 'home' });
  },
  beforeDestroy() {
    this.$eventBus.$off('fetch data', this.fetchDataHandler);
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
  &:disabled {
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
