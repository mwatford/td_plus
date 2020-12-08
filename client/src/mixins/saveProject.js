import { mapState } from 'vuex';
import { manageProject } from '../services/LocalDbManager';

export default {
  data: () => ({}),
  computed: {
    ...mapState({
      project: state => state.activeProject.data,
      auth: state => state.auth.status,
    }),
  },
  methods: {
    async save() {
      this.auth ? this.saveToDB() : this.saveLocal();
    },
    async saveToDB() {
      alert()
    },
    async saveLocal() {
      try {
        await manageProject('add', this.project);
      } catch (e) {
        this.alert('error', e || 'Something went wrong');
      }
    },
  },
};
