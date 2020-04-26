<template>
  <div class="profile box m-auto">
    <button class="button as--end" @click="deleteAccount">
      Delete account
    </button>
    <form @submit.prevent>
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
      <div class="row buttons">
        <button class="button" @click="save" type="submit" :disabled="!valid">
          Save
        </button>
        <button class="button" @click="navigate(-1)">Back</button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import boxAnimations from '../mixins/boxAnimations';
import navigate from '../mixins/navigate';

export default {
  mixins: [boxAnimations, navigate],
  data() {
    return {
      name: '',
      changes: {},
    };
  },
  computed: {
    ...mapState({
      user: state => state.user,
      token: state => state.auth.token,
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
    },
  },
  methods: {
    save() {
      this.$store
        .dispatch('user/save', {
          changes: this.changes,
          token: this.token,
          id: this.user._id,
        })
        .then(this.handleResponse);
    },
    handleResponse() {
      this.alert('success', 'Your profile has been upated');
      this.$store.commit('user/SET_USER', this.changes);
    },
    deleteAccount() {
      this.$http({
        method: 'delete',
        url: `/api/users/current`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }).then(this.$auth.logout);
    },
  },
  mounted() {
    this.boxEnterAnimation(300, 0, false);
  },
  beforeRouteLeave(to, from, next) {
    this.boxExitAnimation(500, 0, false).then(next);
  },
};
</script>

<style lang="scss" scoped>
.row {
  align-items: center;
}
.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.box {
  width: auto;
  height: auto;
  padding: 50px;
}
.button {
  margin-bottom: 10px;
}
.buttons {
  margin-top: 20px;

  .button {
    min-width: 100px;
    margin: 0 auto;
  }
}
input[type='text'] {
  margin: 10px 5px 10px 0;
  height: 20px;
  width: 200px;
}
input[type='checkbox'] {
  margin: 10px 5px 10px auto;
}
</style>
