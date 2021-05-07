const findUserProjects = (Project, projects) =>
  Project.find({}, 'name members password admin')
    .where('_id')
    .in(projects)
    .exec()

const removeUserFromProject = user => project => {
  const member = project.members.find(el => user._id.equals(el.id))
  const index = project.members.indexOf(member)
  if (index !== -1) project.members.splice(index, 1)

  return project.save()
}

module.exports = {
  removeUserFromProject,
  findUserProjects,
}
