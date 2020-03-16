<template>
  <div class="col wrapper m-auto">
    <div class="row controls">
      <div class="row">
        <button
          :class="[
            `button button--start`,
            { 'button--active': currentView === 'dashboard' }
          ]"
          :disabled="!buttonsActive"
          @click="changeView('dashboard')"
        >
          Dashboard
        </button>
        <button
          :disabled="!buttonsActive"
          :class="[`button`, { 'button--active': currentView === 'main' }]"
          @click="changeView('main')"
        >
          Main
        </button>
        <button
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
            { 'button--active': currentView === 'manage' }
          ]"
          :disabled="!buttonsActive"
          @click="changeView('manage')"
          v-if="project.admin === user._id"
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
import { mapState } from "vuex";
import navigate from "../../mixins/navigate";
import Project from "./Project.vue";
import Chat from "./Chat.vue";

export default {
  components: {
    Project,
    Chat
  },
  mixins: [navigate],
  data() {
    return {
      buttonsActive: false,
      currentView: "",
      chat: false
    };
  },
  computed: {
    ...mapState({
      user: state => state.user,
      token: state => state.auth.token,
      project: state => state.activeProject
    }),
    permissions() {
      return this.project.members.find(el => el.id == this.user._id)
        .permissions;
    }
  },
  methods: {
    fetchData() {
      this.$store
        .dispatch("activeProject/fetchProject", {
          project: this.project,
          token: this.token
        })
        .then(({ data }) => {
          this.$store.commit("activeProject/RESET_STATE");
          this.$store.commit("activeProject/SET_PROJECT", data);

          this.activateButtons();
          this.toggleChat();
          this.changeView("dashboard");
        })
        .catch(err => {
          this.$store.dispatch("alerts/display", {
            message: err.response.data,
            type: "error"
          });
          this.navigate("home");
        });
    },
    toggleChat() {
      this.chat = !this.chat;
    },
    changeView(view) {
      this.$eventBus.$emit("changeView", view);
      this.currentView = view;
    },
    activateButtons() {
      this.buttonsActive = true;
    },
    async connect() {
      return this.$socket.connect({
        query: {
          user: this.user._id,
          project: this.project._id
        }
      });
    }
  },
  created() {
    // this.$eventBus.$on("correct password", this.activateButtons);
    this.$eventBus.$on("fetch data", async () => {
      await this.fetchData();

      await this.connect();
    });
  },
  beforeDestroy() {
    this.$socket.close();
    console.log("dc");
  },
  beforeRouteLeave(from, to, next) {
    this.$store.commit("activeProject/RESET_STATE");
    next();
  }
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
