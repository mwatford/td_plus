<template>
  <div class="home">
    <div class="create" @click="navigate('create')" ref="create">
      <app-icon type="plus" size="100"></app-icon>
    </div>
    <router-link
      v-for="project in projects"
      :key="project._id"
      :to="{ path: `/project/${project.name}` }"
      ref="project-link"
    >
      <ProjectTile
        :project="project"
        v-if="display"
        @click.native="setActiveProject(project)"
      ></ProjectTile>
    </router-link>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ProjectTile from 'Components/ProjectTile.vue'
import boxAnimations from 'Mixins/boxAnimations'
import navigate from 'Mixins/navigate'
import { manageProject } from 'Services/LocalDbManager'
import http from 'Services/api/index'

export default {
  mixins: [boxAnimations, navigate],
  components: {
    ProjectTile,
  },
  data() {
    return {
      display: false,
    }
  },
  computed: {
    ...mapState({
      user: state => state.user,
      projects: state => state.projects.data,
      token: state => state.auth.token,
      auth: state => state.auth.status,
    }),
  },
  methods: {
    async getProjects() {
      try {
        let projects = await manageProject('get')

        if (!this.auth) {
          return projects.length
            ? this.$store.commit('projects/SET_PROJECTS', projects)
            : 0
        }

        if (projects.length) {
          await this.importLocalProjects(projects)
        }

        await this.fetchProjects()
      } catch (e) {
        this.alert('error', e)
      }
    },
    async fetchProjects() {
      try {
        await this.$store.dispatch('projects/fetchProjects', {
          token: this.token,
          id: this.user._id,
        })
      } catch (e) {
        this.alert('error', e)
      }
    },
    async setActiveProject(project) {
      try {
        if (this.auth) {
          const { data } = await http.projects.fetchActiveProject(
            this.token,
            project._id
          )
          project = data
        }

        this.$store.commit('activeProject/SET_PROJECT', project)
      } catch (e) {
        this.alert('error', e || 'Something went wrong')
      }
    },
    async importLocalProjects(projects) {
      const userResponse = confirm(
        'We have found local projects, do you want to import them?'
      )

      if (userResponse) {
        const { data } = await http.projects.import(this.token, projects)

        this.$store.commit('projects/SET_PROJECTS', data)

        await manageProject('removeAll')
      }
    },
  },
  beforeUpdate() {
    this.display = true
  },
  mounted() {
    this.getProjects()
      .then(() => this.boxEnterAnimation(200, 50, true))
      .catch(e => {})
  },
  beforeRouteLeave(to, from, next) {
    this.boxExitAnimation(500, 20, true)
      .then(next)
      .catch(e => {})
  },
}
</script>

<style lang="scss" scoped>
.home {
  display: grid;
  justify-content: center;
  grid-gap: 40px;
  grid-template-columns: repeat(auto-fill, 250px);
  grid-auto-rows: 250px;
  padding: 40px;
  overflow-y: auto;
}
.create {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  border-radius: 16px;
  border: 2px dashed #fff;

  div {
    font-size: 72px;
    height: 100px;
    width: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    display: flex;
    border-radius: 50%;
    border: 5px solid #fff;
    font-family: Arial, Helvetica, sans-serif;
  }
}
</style>
