import { mapState } from 'vuex'
import { manageProject } from '../services/LocalDbManager'
import http from 'Services/api/index'

export default {
  data: () => ({}),
  computed: {
    ...mapState({
      project: state => state.activeProject.data,
      auth: state => state.auth.status,
      token: state => state.auth.token,
    }),
  },
  methods: {
    async save() {
      this.auth ? this.saveToDB() : this.saveLocal()
    },
    async saveToDB() {
      await this.project.save(
        http.projects.updateProject(this.token, this.project._id)
      )

      this.$socket.emit('updated', this.project)
    },
    async saveLocal() {
      try {
        await manageProject('add', this.project)
      } catch (e) {
        this.alert('error', e || 'Something went wrong')
      }
    },
  },
}
