const helpers = require('./helpers')

const create = models => async ({ id, project }) => {
  const { User } = models
  const admin = await User.findById(id)

  if (admin) {
    const newProject = await helpers.saveProject(models, project, admin)

    return { data: newProject, status: 201 }
  }
}

const getUserProjects = models => async ({ id }) => {
  const { User, Project } = models

  const user = await User.findById(id)

  const projects = await Project.find({}, 'name members password admin')
    .where('_id')
    .in(user.projects)
    .exec()

  return { data: projects, status: 200 }
}

const getProject = models => async ({ id, projectId }) => {
  const { Project } = models
  const project = await Project.findById(projectId)

  const isMember = await project.members.find(member => id === member)

  if (isMember) {
    return {
      status: 200,
      data: project,
    }
  }
  return {
    status: 403,
  }
}

const isAdmin = models => async ({ id, projectId }) => {
  const { Project } = models

  const project = await Project.findById(projectId)
  const isAdmin = project.admin === id

  if (isAdmin) {
    return { status: 200 }
  }
  return { status: 403 }
}

const deleteProject = models => async ({ id, projectId }) => {
  const { Project, User } = models
  // const { _id } = await User.findOne({ id });
  const project = await Project.findById(projectId)
  const isAdmin = project.admin === id

  if (isAdmin) {
    await Project.findByIdAndRemove(
      projectId,
      helpers.updateUsersAfterDelete(User)
    )

    return { status: 200 }
  } else {
    return { status: 403 }
  }
}

const importProjects = models => async ({ id, projects }) => {
  const { User, Project } = models

  let admin = await User.findById(id)

  if (admin) {
    await Promise.all(
      projects.map(project => helpers.saveProject(models, project, admin))
    )
  }

  admin = await User.findById(id)

  const userProjects = await Project.find({}, 'name members password admin')
    .where('_id')
    .in(admin.projects)
    .exec()

  return { status: 200, data: userProjects }
}

const activeProject = models => async ({ id }) => {
  const { User, Project } = models

  let project = await Project.findById(id)

  const members = await Promise.all(
    project.members.map(member => User.findById(member.id, 'name email'))
  )

  for (let i = 0; i < project.members.length; i++) {
    const { name, email } = members[i]

    Object.assign(project.members[i], { name, email })
  }

  return { status: 200, data: project }
}

const update = models => async ({ project, id }) => {
  const { Project } = models
  const projectToOverwrite = await Project.findById(id)

  Object.assign(projectToOverwrite, project)

  await projectToOverwrite.save()

  const { data } = await activeProject(models)({ id })

  return { status: 200, data }
}

const addUser = models => async ({ id, userId }) => {
  const { User, Project } = models
  const user = await User.findById(userId)
  const project = await Project.findById(id)

  if (!user || !project) return { status: 404 }

  const isMember = project.members.find(el => user._id.equals(el.id))

  if (isMember)
    return {
      status: 200,
      data: { message: { type: 'info', message: 'User is already a member' } },
    }

  project.members.push({
    id: user._id.toString(),
    role: 'basic',
    permissions: [],
  })

  user.projects.push(project._id.toString())

  await project.save()
  await user.save()

  return { status: 200, data: project }
}

const removeUser = models => async ({ id, userId }) => {
  const { User, Project } = models
  const user = await User.findById(userId)
  const project = await Project.findById(id)
  const isMember = project.members.findIndex(el => el.id === userId)
  const isProject = user.projects.findIndex(el => el === id)

  if (isMember === -1 || isProject === -1) return { status: 200 }

  project.members.splice(isMember, 1)
  user.projects.splice(isProject, 1)

  await project.save()
  await user.save()

  return { status: 200, data: project }
}

module.exports = models => ({
  create: create(models),
  getUserProjects: getUserProjects(models),
  getProject: getProject(models),
  deleteProject: deleteProject(models),
  isAdmin: isAdmin(models),
  import: importProjects(models),
  activeProject: activeProject(models),
  update: update(models),
  removeUser: removeUser(models),
  addUser: addUser(models),
})
