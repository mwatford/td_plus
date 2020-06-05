const updateUsersAfterDelete = User => (err, { members, _id }) => {
  return members.map(async member => {
    const user = await User.findById(member);
    const index = user.projects.indexOf(_id);

    if (index !== -1) {
      user.projects.splice(index, 1);
      return user.save();
    }
  });
};

const saveProject = async ({ Project }, project, admin) => {
  project.admin = admin._id;
  project.members = [{ id: String(admin._id), role: 'admin', permissions: [] }];

  const newProject = await new Project(project).save();
  admin.projects.push(String(newProject._id));

  await admin.save();

  return newProject;
};

module.exports = { saveProject, updateUsersAfterDelete };
