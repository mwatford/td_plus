<template>
  <loading v-if="loading !== 'start'" :state="loading" :size="60"></loading>
  <div v-else class="m-auto row view">
    <AddTask></AddTask>
    <ProjectLists></ProjectLists>
    <MemberList v-if="auth"></MemberList>
    <button @click="deleteProject" class="button">
      DELETE PROJECT
    </button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import navigate from 'Mixins/navigate';
import snippet from 'Mixins/snippet';
import cloneDeep from 'Utils/cloneDeep';
import UserSearch from './search.vue';
import { manageProject } from 'Services/LocalDbManager';
import http from 'Services/api/index';
import AddTask from './AddTask.vue';
import MemberList from './MemberList.vue';
import ProjectLists from './ProjectLists.vue';

export default {
  mixins: [navigate, snippet],
  components: {
    UserSearch,
    AddTask,
    MemberList,
    ProjectLists,
  },
  data() {
    return {
      loading: 'start',
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
  },
  methods: {
    ...mapMutations({ update: 'activeProject/UPDATE' }),
    async authenticate() {
      this.loading = 'loading';
      try {
        await http.projects.isAdmin(this.token, this.project._id);
        this.loading = 'start';
      } catch (error) {
        this.loading = 'failed';
        this.alert('error', e.response.data);
        this.navigate(-1);
      }
    },
    async deleteProject() {
      const confirmed = confirm(
        `Are you absolutely sure you want to delete '${this.project.name}'?`
      );

      if (!confirmed) return;

      try {
        if (!this.auth) {
          await manageProject('delete', this.project);
        } else {
          await http.projects.delete(this.token, this.project._id);
          this.$socket.emit('project deleted');
        }
        this.alert('success', 'Project has been deleted');
        this.navigate({ name: 'home' });
      } catch (error) {
        this.alert('error', 'Something went wrong');
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
    updateProject() {
      this.loading = 'start';

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
          this.alert('error', 'Your changes have not been saved.');
        });
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
    async removeUser(user, index) {
      try {
        await http.projects.removeUser(this.token, {
          id: this.project._id,
          userId: user.id,
        });
        this.alert('success', 'User has been removed');
      } catch (e) {
        this.alert('error', 'User was not removed');
      }
    },
    updateUser({ projects, _id }, action) {
      if (action === 'add') {
        projects.push(this.project._id);
      }

      return this.$this.http({
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
      this.$eventBus.$on('close-modal', this.closeModal);
      this.$eventBus.$on('add-user', this.addUser);
    }
  },
  beforeDestroy() {
    this.$eventBus.$off('add-user', this.addUser);
    this.$eventBus.$off('close-modal', this.closeModal);
  },
};
</script>

<style lang="scss" scoped>
.suggestions {
  height: auto;
}
.box {
  padding: 50px;
}
</style>
