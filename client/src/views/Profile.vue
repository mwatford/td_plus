<template>
  <div class="profile">
    <form @submit.prevent class="box">
      <div class="col">
        <label for="name">Change name</label>
        <div class="row">
          <input
            type="text"
            class="input"
            name="newName"
            id=""
            v-model="name"
          />
          <input
            type="text"
            class="input"
            name="name"
            id=""
            disabled
            :value="user.name"
          />
        </div>
      </div>
      <div class="row">
        <button class="button" @click="save" type="submit" :disabled="!valid">
          Save
        </button>
        <button class="button" @click="navigate(-1)">Back</button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState } from "vuex";
import boxAnimations from "../mixins/boxAnimations";
import navigate from "../mixins/navigate";

export default {
  mixins: [boxAnimations, navigate],
  data() {
    return {
      name: "",
      changes: {}
    };
  },
  computed: {
    ...mapState({
      user: state => state.user,
      token: state => state.auth.token
    }),
    valid() {
      return this.testName;
    },
    testName() {
      if (this.name) {
        this.changes.name = this.name;
        return true;
      } else {
        delete this.changes.name;
        return false;
      }
    }
  },
  methods: {
    save() {
      this.$store
        .dispatch("user/save", {
          email: this.user.email,
          changes: this.changes,
          token: this.token
        })
        .then(this.handleResponse);
    },
    handleResponse(response) {
      const { message, type } = response.data;

      this.$store.dispatch("alerts/display", { message, type });

      if (type === "success") {
        this.$store.commit("user/SET_USER", this.changes);
      }
    },
  },
  mounted() {
    this.boxEnterAnimation(300, 0, false);
  },
  beforeRouteLeave(to, from, next) {
    this.boxExitAnimation(500, 0, false).then(next);
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.box {
  width: auto;
}
.button {
  width: 100px;
  margin: auto;
}
input[type="text"] {
  margin: 10px 5px 10px 0;
  height: 20px;
  width: 200px;
}
</style>
