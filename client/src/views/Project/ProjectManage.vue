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
      <button class="button" @click="addTask">ADD</button>
    </form>
    <ul>
      <li v-for="(list, index) in project.lists" :key="index" class="row">
        <div
          class="row change-name"
          @click="changeListName(index)"
          title="change name"
        >
          <h4>
            {{ list.name }}
          </h4>
        </div>
        <div class="icon" @click="deleteList(index)">
          <app-icon type="cross" size="14" class="m-auto"></app-icon>
        </div>
      </li>
      <li class="row add" @click="addList" title="add new list">
        <app-icon class="m-auto" type="plus" size="19"></app-icon>
      </li>
    </ul>
    <button @click="deleteProject" class="button">delete</button>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import navigate from '../../mixins/navigate';
import cloneDeep from '../../utils/cloneDeep';

export default {
  mixins: [navigate],
  data() {
    return {
      loading: 'start',
      task: this.createEmptyTask(),
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
      const task = {
        name: '',
        description: '',
      };

      return !this.auth
        ? task
        : Object.assign(task, {
            member: '',
          });
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
        `Are you absolutely sure you want to delete ${this.project.name}?`
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
        this.navigate({ name: 'home' });
      });
    },
    deleteLocal() {
      const { index } = this.getLocalProject();

      if (index > -1) {
        this.$store.commit('projects/REMOVE', index);

        localStorage.setItem(
          'projects',
          JSON.stringify(this.$store.state.projects.data)
        );

        this.navigate({ name: 'home' });
      }
    },
    getLocalProject() {
      const project = this.$store.state.projects.data.find(
        el => el.name === this.project.name
      );
      const index = this.$store.state.projects.data.indexOf(project);

      return { index, project };
    },
    changeListName(index) {
      const name = prompt(`Rename '${this.project.lists[index].name}':`);

      if (name) {
        this.$store.commit('activeProject/UPDATE_LIST_NAME', {
          name,
          index,
        });
        const project = cloneDeep(this.project);

        this.save(project);
      }
    },
    updateLocalProject(project) {
      const projects = cloneDeep(this.$store.state.projects);
      const { index } = this.getLocalProject();

      projects.data[index] = project;

      localStorage.setItem('projects', JSON.stringify(projects.data));
    },
    updateProject(project) {
      this.loading = 'loading';

      this.$store
        .dispatch('activeProject/updateProject', project)
        .then(() => {
          this.loading = 'start';
        })
        .catch(e => {
          this.alert(
            'error',
            'Error while updating the project, you will be redirected to home page.'
          );
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
      const project = cloneDeep(this.project);

      return !this.auth
        ? this.updateLocalProject(project)
        : this.updateProject(project);
    },
  },
  mounted() {
    if (this.auth) this.authenticate();
  },
};
</script>

<style lang="scss" scoped>
form {
  height: 458px;
  max-height: 100%;
  justify-content: flex-start;

  .button {
    margin-top: 20px;
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
    cursor: pointer;
    background: #000000cc;
    border-radius: 2px;
    color: #fff;
    margin-bottom: 3px;
    width: 250px;
    height: 43px;

    .icon {
      height: 100%;
      width: 43px;
      display: flex;
    }
    .change-name {
      justify-content: space-between;
      align-items: center;
      padding: 0 12px;
      width: 100%;
      height: 100%;
    }
  }
  .change-name,
  .icon,
  li.add {
    &:hover {
      background: #000000da;
    }
  }
}
</style>
