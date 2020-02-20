<template>
  <div class="create row">
    <form action="" class="form" @submit.prevent>
      <ul class="col form members" v-if="memberList.length">
        <h3>Members</h3>
        <li
          v-for="suggestion in memberList"
          :key="suggestion._id"
          @click="removeUser(suggestion)"
          class="form__user col"
          title="Remove"
        >
          <h4>{{ suggestion.name }}</h4>
          <h5>
            {{ suggestion.email }}
          </h5>
        </li>
      </ul>
      <ul class="col form suggestions" v-if="suggestions.length">
        <h3>Invite</h3>
        <li
          v-for="suggestion in suggestions"
          :key="suggestion._id"
          @click="addUser(suggestion)"
          class="form__user col"
          title="Invite"
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
        <div class="row">
          <input
            type="text"
            class="input"
            name="invite"
            v-model="member"
            placeholder="invite people"
          />
        </div>
      </div>
      <div class="row">
        <button class="button" @click="create">Create</button>
        <button class="button" @click="cancel">Back</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  data() {
    return {
      member: "",
      responseList: [],
      memberList: [],
      project: {
        name,
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
    addUser(user) {
      this.project.members.push(user._id);
      this.memberList.push(user);
    },
    removeUser(index) {
      this.memberList.splice(index, 1);
      this.project.members.splice(index, 1);
    },
    create() {
      axios({
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
      })
        .then(response => {
          return this.$store.dispatch("user/fetchUser", {
            token: this.token,
            email: this.user.email
          });
        })
        .then(() => {
          this.$router.push({ name: "home" });
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
.form {
  position: relative;

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
      box-shadow: 0 0 6px 0px #fff;
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
