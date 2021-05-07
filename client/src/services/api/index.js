import axios from 'axios'
import projects from './projects'
import users from './users'

const http = a => ({
  projects: projects(a),
  users: users(a),
})

export default http(axios)
