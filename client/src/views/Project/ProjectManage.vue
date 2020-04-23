<template>
  <loading v-if="loading !== 'start'" :state="loading" :size="60"></loading>
  <div v-else class="m-auto view row">
    <form action="" class="box col">
      <h3>Add task</h3>
      <input type="text" class="input" placeholder="name" />
      <textarea
        class="input"
        placeholder="description"
        v-model="task.description"
      />
      <div class="col" v-if="auth">
        <label>
          Select member
        </label>
        <select v-model="task.member">
          <option
            v-for="(member, index) in members"
            :key="index"
            :value="member.id"
            >{{ member.name }}</option
          >
        </select>
      </div>
    </form>
    <ul>
      <li
        v-for="(list, index) in project.lists"
        :key="index"
        @click="changeListName(index)"
      >
        <h4>
          {{ list.name }}
        </h4>
      </li>
      <li class="row">
        <app-icon class="m-auto" type="plus"></app-icon>
      </li>
    </ul>
    <button @click="deleteProject" class="button">delete</button>
  </div>
</template>

<script>
import { mapState } from 'vuex';
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
    addTask() {
      // this.$socket.emit('addTask', this.task);

      this.task = this.createEmptyTask();
    },
    authenticate() {
      this.loading = 'loading';

      this.$http({
        method: 'get',
        url: `/api/projects/${this.project._id}/admin`,
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
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
          'Content-Type': 'application/json',
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

      if (name && !this.auth) {
        this.$store.commit('activeProject/UPDATE_LIST_NAME', {
          name,
          index,
        });
        this.updateLocalProject(cloneDeep(this.project));
      }

      if (name && this.auth) {
        const project = cloneDeep(this.project);

        project.lists[index].name = name;

        this.updateProject(project);
      }
    },
    updateLocalProject(project) {
      const projects = cloneDeep(this.$store.state.projects);

      const { index } = this.getLocalProject();

      projects.data[index] = project;

      localStorage.setItem('projects', JSON.stringify(projects.data));
    },
    updateProject(project) {
      this.$store
        .dispatch('activeProject/updateProject', project)
        .then(({ data }) => {
          this.$store.commit('activeProject/SET_PROJECT', data);

          this.alert(
            'success',
            'Project updated, your changes will be visible in Dashboard'
          );
        });
    },
  },
  mounted() {
    if (this.auth) this.authenticate();
  },
};
</script>

<style lang="scss" scoped>
form {
  height: auto;
  justify-content: flex-start;
}
label {
  margin: 5px 0;
}
textarea {
  max-width: 100%;
  min-width: 100%;
  max-height: 100%;
  height: auto;
  border: 1px dashed #fff;
  border-bottom: 2px solid #fff;
}
ul {
  margin-left: 10px;
  list-style-type: none;

  li {
    cursor: pointer;
    background: #000000cc;
    border-radius: 2px;
    color: #fff;
    margin-bottom: 10px;
    width: 250px;
    padding: 12px;

    &:hover {
      background: #000000da;
    }
  }
}
</style>
