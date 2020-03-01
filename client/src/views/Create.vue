<template>
  <div class="create row">
    <form action="" class="box" @submit.prevent>
      <ul class="col box suggestions" v-if="suggestions.length">
        <h3>Invite</h3>
        <li
          v-for="suggestion in suggestions"
          :key="suggestion._id"
          @click="addUser(suggestion)"
          class="box__user col"
          title="Invite"
        >
          <h4>{{ suggestion.name }}</h4>
          <h5>
            {{ suggestion.email }}
          </h5>
        </li>
      </ul>
      <ul class="col box members" v-if="memberList.length">
        <h3>Members</h3>
        <li
          v-for="suggestion in memberList"
          :key="suggestion._id"
          @click="removeUser(suggestion)"
          class="box__user col"
          title="Remove"
        >
          <h4>{{ suggestion.name }}</h4>
          <h5>
            {{ suggestion.email }}
          </h5>
        </li>
      </ul>
      <div class="col">
        <input
          type="text"
          name="name"
          placeholder="project name"
          v-model="project.name"
          class="input"
        />
        <input
          type="text"
          class="input"
          name="invite"
          v-model="member"
          placeholder="invite people"
        />
        <input
          type="password"
          class="input"
          name="invite"
          v-model="password"
          placeholder="password (optional)"
        />
      </div>
      <div class="row">
        <button class="button m-auto" @click="create">Create</button>
        <button class="button m-auto" @click="cancel">Back</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import boxAnimations from "../mixins/boxAnimations";
import { hashPassword } from "../utils/password";

export default {
  mixins: [boxAnimations],
  data() {
    return {
      member: "",
      password: "",
      responseList: [],
      memberList: [],
      project: {
        name,
        password: "",
        members: []
      }
    };
  },
  computed: {
    ...mapState({
      user: state => state.user,
      token: state => state.auth.token
    }),
    suggestions() {
      const suggestions = this.responseList.filter(
        el => el._id !== this.user._id
      );

      this.memberList.forEach(el => {
        const element = suggestions.find(elem => elem._id === el._id);
        const index = suggestions.indexOf(element);
        suggestions.splice(index, 1);
      });
      return suggestions;
    }
  },
  methods: {
    hashPassword,
    addUser(user) {
      this.project.members.push(user._id);
      this.memberList.push(user);
    },
    removeUser(index) {
      this.memberList.splice(index, 1);
      this.project.members.splice(index, 1);
    },
    create() {
      new Promise(resolve => {
        if (this.password) {
          this.hashPassword(this.password).then(hash => {
            this.project.password = hash;
            resolve();
          });
        } else {
          resolve();
        }
      })
        .then(this.request)
        .then(response => {
          return this.$store.dispatch("user/fetchUser", {
            token: this.token,
            email: this.user.email
          });
        })
        .then(() => {
          this.$router.push({ name: "home" });
        })
        .catch(e => {
          console.log(e);
        });
    },
    request() {
      return this.$http({
        method: "post",
        url: "/api/projects/create",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json"
        },
        data: {
          email: this.user.email,
          project: this.project
        }
      });
    },
    cancel() {
      this.$router.go(-1);
    },
    fetchUsers(search) {
      this.$http({
        method: "get",
        url: `/api/users/search/${search}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json"
        }
      }).then(response => {
        this.responseList = response.data;
      });
    }
  },
  mounted() {
    this.boxEnterAnimation(300, 0, false);
  },
  beforeRouteLeave(to, from, next) {
    this.boxExitAnimation(300, 0, false).then(next);
  },
  watch: {
    member(n) {
      if (this.member.length > 3) {
        this.fetchUsers(n);
      }
    }
  }
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

  h2 {
    margin-bottom: 2px;
  }

  &__user {
    cursor: pointer;
    margin: 2px auto;
    width: 100%;
    border-radius: 4px;
    padding: 8px;
    transition: all 0.2s ease;

    &:hover {
      background: #000000a2;
    }
  }
}
.suggestions,
.members {
  position: absolute;
  justify-content: flex-start;
  top: 0;
  height: 100%;
}
.suggestions {
  right: 100%;
  margin-right: 40px;
}
.members {
  left: 100%;
  margin-left: 40px;
}
</style>
