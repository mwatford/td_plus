<template>
  <loading v-if="loading !== 'start'" :state="loading" :size="60"></loading>
  <div v-else class="m-auto row view">
    <AddTask></AddTask>
    <ProjectLists></ProjectLists>
    <MemberList v-if="auth"></MemberList>
    <button @click="deleteProject" class="button">DELETE PROJECT</button>
    <UserSearch v-if="searchOpen"></UserSearch>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import navigate from 'Mixins/navigate'
import snippet from 'Mixins/snippet'
import saveProject from 'Mixins/saveProject'
import cloneDeep from 'Utils/cloneDeep'
import UserSearch from './search.vue'
import { manageProject } from 'Services/LocalDbManager'
import http from 'Services/api/index'
import AddTask from './AddTask.vue'
import MemberList from './MemberList.vue'
import ProjectLists from './ProjectLists.vue'

export default {
  mixins: [navigate, snippet, saveProject],
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
      searchOpen: false,
    }
  },
  computed: {
    ...mapState({
      project: state => state.activeProject.data,
      token: state => state.auth.token,
      auth: state => state.auth.status,
    }),
  },
  mounted() {
    if (this.auth) {
      this.authenticate()
      this.$eventBus.$on('open-search', this.openSearch)
      this.$eventBus.$on('close-search', this.closeSearch)
    }
  },
  beforeDestroy() {
    this.$eventBus.$off('open-search', this.openSearch)
    this.$eventBus.$off('close-search', this.closeSearch)
  },
  methods: {
    ...mapMutations({ update: 'activeProject/UPDATE' }),
    openSearch() {
      this.searchOpen = true
    },
    closeSearch() {
      this.searchOpen = false
    },
    async authenticate() {
      try {
        this.loading = 'loading'
        await http.projects.isAdmin(this.token, this.project._id)
        this.loading = 'start'
      } catch (e) {
        this.loading = 'failed'
        this.alert('error', e.response.data)
        this.navigate(-1)
      }
    },
    async deleteProject() {
      try {
        const confirmed = confirm(
          `Are you absolutely sure you want to delete '${this.project.name}'?`
        )

        if (!confirmed) return

        if (!this.auth) {
          await manageProject('delete', this.project)
        } else {
          await http.projects.delete(this.token, this.project._id)
          this.$socket.emit('project-deleted')
        }

        this.alert('success', 'Project has been deleted')
        this.navigate({ name: 'home' })
      } catch (error) {
        this.alert('error', 'Something went wrong')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.suggestions {
  height: auto;
}
.box {
  padding: 50px;
}
.button {
  margin-left: auto;
}
</style>
