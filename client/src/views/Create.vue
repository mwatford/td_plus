<template>
  <div class="create row">
    <form action="" class="box">
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
          type="text"
          class="input"
          name="invite"
          v-model="search"
          data-search
          placeholder="invite people"
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
      <ul
        class="col box suggestions"
        v-if="suggestions.length"
        ref="suggestions"
      >
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
      <ul class="col box members" v-if="memberList.length" ref="members">
        <h3>Members</h3>
        <li
          v-for="(member, index) in memberList"
          :key="member._id"
          @click="removeUser(index)"
          class="box__user col"
          title="Remove"
        >
          <h4>{{ member.name }}</h4>
          <h5>
            {{ member.email }}
          </h5>
        </li>
      </ul>
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
      search: '',
      password: '',
      responseList: [],
      memberList: [],
      project: this.createEmptyProject(),
    };
  },
  computed: {
    ...mapState({
      user: state => state.user,
      token: state => state.auth.token,
      auth: state => state.auth.status,
    }),
    //test
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
    },
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
    addUser(user) {
      this.project.members.push({
        id: user._id,
        type: 'basic',
        permissions: [],
      });
      this.memberList.push(user);
    },
    removeUser(index) {
      this.project.members.splice(index, 1);
      this.memberList.splice(index, 1);
    },
    create() {
      return this.createPassword()
        .then(this.saveProject)
        .then(this.updateUser)
        .then(this.navigate({ name: 'home' }))
        .catch(e => {
          this.navigate({ name: 'home' });
        });
    },
    createPassword() {
      return new Promise(resolve => {
        if (this.password) {
          this.hashPassword(this.password).then(hash => {
            this.project.password = hash;
            resolve();
          });
        } else {
          resolve();
        }
      });
    },
    saveProject() {
      if (this.auth) {
        return this.request();
      } else return this.saveLocally();
    },
    request() {
      if (this.auth) {
        return this.$http({
          method: 'post',
          url: '/api/projects/create',
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
          data: {
            email: this.user.email,
            project: this.project,
          },
        });
      } else return;
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
      } else return;
    },
    fetchUsers(search) {
      this.$http({
        method: 'get',
        url: `/api/users/search/${search}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }).then(response => {
        this.responseList = response.data;
      });
    },
  },
  mounted() {
    this.boxEnterAnimation(300, 0, false);
  },
  beforeRouteLeave(to, from, next) {
    this.boxExitAnimation(300, 0, false).then(next);
  },
  watch: {
    search(n) {
      if (n.length > 3) {
        this.fetchUsers(n);
      }
    },
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
