<template>
  <loading v-if="loading !== 'start'" :state="loading" :size="60"></loading>
  <div v-else class="m-auto row view">
    <form action="" class="box col">
      <h3>Add task</h3>
      <input
        type="text"
        class="input"
        placeholder="name"
        v-model="task.name"
        required
      />
      <textarea
        class="input"
        placeholder="description"
        v-model="task.description"
      />
      <div class="col" v-if="auth">
        <label>
          Select member
        </label>
        <select v-model="task.member" required>
          <option
            v-for="(member, index) in members"
            :key="index"
            :value="member.id"
            >{{ member.name }}</option
          >
        </select>
      </div>
      <button class="button" @click="addTask">
        <app-icon
          class="m-auto"
          type="plus"
          size="19"
          color="inherit"
        ></app-icon>
      </button>
    </form>
    <div class="list">
      <ul>
        <li><h3 class="m-auto">Lists</h3></li>
        <li v-for="(list, index) in project.lists" :key="index" class="row">
          <div
            class="row text"
            @click="changeListName(index)"
            title="change name"
          >
            <h4>
              {{ snippet(list.name, 16) }}
            </h4>
          </div>
          <div class="icon" @click="deleteList(index)" title="delete list">
            <app-icon type="cross" size="14" class="m-auto"></app-icon>
          </div>
        </li>
        <li
          class="row add"
          @click="addList"
          title="add new list"
          v-if="project.lists.length < 9"
        >
          <app-icon class="m-auto" type="plus" size="19"></app-icon>
        </li>
      </ul>
    </div>
    <div class="list" v-if="project.members.length">
      <ul>
        <li><h3 class="m-auto">Members</h3></li>
        <li v-for="(member, index) in project.members" :key="index" class="row">
          <div class="row text" title="edit user's permissions">
            <h4>
              {{ snippet(member.name, 16) }}
            </h4>
          </div>
          <button
            class="icon"
            @click="removeUser(member, index)"
            title="remove member"
            v-if="member.id !== project.admin"
          >
            <app-icon type="cross" size="14" class="m-auto"></app-icon>
          </button>
        </li>
        <li
          class="row add"
          @click="search = true"
          title="find member"
          v-if="project.members.length < 9"
        >
          <app-icon class="m-auto" type="search" size="19"></app-icon>
        </li>
      </ul>
      <app-search v-if="search"></app-search>
    </div>
    <button @click="deleteProject" class="button">DELETE PROJECT</button>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import navigate from '../../mixins/navigate';
import snippet from '../../mixins/snippet';
import cloneDeep from '../../utils/cloneDeep';
import search from './search.vue';

export default {
  mixins: [navigate, snippet],
  components: {
    'app-search': search,
  },
  data() {
    return {
      loading: 'start',
      task: this.createEmptyTask(),
      limit: 9,
      search: false,
    };
  },
  computed: {
    ...mapState({
      project: state => state.activeProject.data,
      token: state => state.auth.token,
      auth: state => state.auth.status,
    }),
    members() {
      return this.project.members;
    },
  },
  methods: {
    createEmptyTask() {
      return {
        name: '',
        description: '',
      };
    },
    authenticate() {
      this.loading = 'loading';

      this.$http({
        method: 'get',
        url: `/api/projects/${this.project._id}/admin`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
        .then(() => {
          this.loading = 'done';

          setTimeout(() => {
            this.loading = 'start';
          }, 500);
        })
        .catch(e => {
          this.loading = 'failed';
          this.alert('error', e.response.data);
          this.$router.go(-1);
        });
    },
    deleteProject() {
      if (this.openDialog()) {
        return this.auth ? this.deleteFromDB() : this.deleteLocal();
      }
    },
    openDialog() {
      return confirm(
        `Are you absolutely sure you want to delete '${this.project.name}'?`
      );
    },
    deleteFromDB() {
      return this.$http({
        method: 'delete',
        url: `/api/projects/${this.project._id}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }).then(() => {
        this.alert('success', 'Project has been deleted');
        this.$socket.emit('project deleted');
        this.navigate({ name: 'home' });
      });
    },
    deleteLocal() {
      const index = this.getCurrentProjectIndex();

      if (index > -1) {
        this.$store.commit('projects/REMOVE', index);

        localStorage.setItem(
          'projects',
          JSON.stringify(this.$store.state.projects.data)
        );

        this.navigate({ name: 'home' });
      }
    },
    changeListName(index) {
      const name = prompt(`Rename list '${this.project.lists[index].name}':`);

      if (name) {
        this.$store.commit('activeProject/UPDATE_LIST_NAME', {
          name,
          index,
        });
        const project = cloneDeep(this.project);

        this.save();
      }
    },
    getCurrentProjectIndex() {
      const project = this.$store.state.projects.data.find(
        el => el.name === this.project.name
      );
      const index = this.$store.state.projects.data.indexOf(project);

      return index;
    },
    updateProject() {
      this.loading = 'loading';

      const changes = cloneDeep({
        lists: this.project.lists,
        members: this.project.members.map(el => ({
          id: el.id,
          role: el.role,
          permissions: el.permissions,
        })),
      });

      return this.$store
        .dispatch('activeProject/updateProject', {
          id: this.project._id,
          changes,
        })
        .then(() => {
          this.loading = 'start';
          this.$socket.emit('updated', this.project);
        })
        .catch(e => {
          this.loading = 'start';
          this.alert('error', 'Error. Your changes have not been saved.');
        });
    },
    addList() {
      const name = prompt('Name:');

      if (name) {
        this.$store.commit('activeProject/ADD_LIST', { data: [], name });

        this.save();
      }
    },
    addTask() {
      this.$store.commit('activeProject/ADD_TASK', this.task);

      this.save();

      this.task = this.createEmptyTask();
    },
    deleteList(index) {
      const confirmed = confirm(
        `Are you sure you want to delete "${this.project.lists[index].name}"`
      );

      if (confirmed) {
        this.$store.commit('activeProject/DELETE_LIST', index);

        this.save();
      }
    },
    save() {
      return !this.auth
        ? this.$store.dispatch('activeProject/saveLocally', this.project.name)
        : this.updateProject();
    },
    closeModal() {
      this.search = false;
    },
    addUser(user) {
      this.$store.commit('activeProject/ADD_MEMBER', {
        id: user._id,
        role: 'basic',
        permissions: [],
      });

      this.updateUser(user, 'add');
      this.updateProject();
    },
    removeUser(user, index) {
      this.$store.commit('activeProject/REMOVE_MEMBER', index);

      this.$http({
        method: 'put',
        url: `/api/projects/${this.project._id}/removeUser/${user.id}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      this.updateProject().then(() =>
        this.$socket.emit('user removed', user.id)
      );
    },
    updateUser({ projects, _id }, action) {
      if (action === 'add') {
        projects.push(this.project._id);
      }

      return this.$http({
        method: 'put',
        url: `/api/users/${_id}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        data: {
          changes: { projects },
        },
      });
    },
  },
  mounted() {
    if (this.auth) {
      this.authenticate();
      this.$eventBus.$on('close modal', this.closeModal);
      this.$eventBus.$on('add user', this.addUser);
    }
  },
  beforeDestroy() {
    this.$eventBus.$off('add user', this.addUser);
    this.$eventBus.$off('close modal', this.closeModal);
  },
};
</script>

<style lang="scss" scoped>
form {
  height: 458px;
  max-height: 100%;
  justify-content: flex-start;

  .button {
    margin: 20px 0 0 0;
  }
}
label {
  margin: 5px 0;
}
textarea {
  max-width: 100%;
  min-width: 100%;
  max-height: 100%;
  height: 100%;
  border: 1px dashed #fff;
  border-bottom: 2px solid #fff;
}
ul {
  margin-left: 3px;
  list-style-type: none;

  li {
    display: flex;
    background: #000000cc;
    border-radius: 2px;
    color: #fff;
    margin-bottom: 3px;
    width: 250px;
    height: 43px;
    overflow: hidden;

    &.row {
      cursor: pointer;
    }

    .icon {
      height: 100%;
      width: 43px;
      display: flex;

      &:hover {
        background: #ff3131b4;
      }
    }
    .text {
      justify-content: space-between;
      align-items: center;
      padding: 0 12px;
      width: 100%;
      height: 100%;
    }
  }
  .text,
  li.add {
    &:hover {
      background: #000000da;
    }
  }
}
.button {
  margin: 0 0 0 auto;
}
.suggestions {
  height: auto;
}
.box {
  padding: 50px;
}
button.icon {
  border: none;
  background: transparent;
}
</style>
