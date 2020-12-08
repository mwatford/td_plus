const sendProjects = http => (token, data) => {
  return http({
    method: 'post',
    url: '/api/projects/import',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data,
  });
};

const fetchActiveProject = http => (token, id) =>
  http({
    method: 'get',
    url: `/api/projects/active/${id}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const updateProject = http => (token, id) => data =>
  http({
    method: 'put',
    url: `/api/projects/${id}`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data,
  });

const create = http => (token, data) =>
  http({
    method: 'post',
    url: '/api/projects/create',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data,
  });

const fetchAllProjects = http => (token, id) =>
  http({
    method: 'get',
    url: `/api/projects/all/${id}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const isAdmin = http => (token, id) =>
  http({
    method: 'get',
    url: `/api/projects/${id}/admin`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const deleteProject = http => (token, id) =>
  http({
    method: 'delete',
    url: `/api/projects/${id}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const addUser = http => (token, { id, userId }) =>
  http({
    method: 'put',
    url: `/api/projects/${id}/addUser/${userId}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const removeUser = http => (token, { id, userId }) =>
  http({
    method: 'put',
    url: `/api/projects/${id}/removeUser/${userId}`,
    headers: { Authorization: `Bearer ${token}` },
  });

export default http => ({
  import: sendProjects(http),
  fetchActiveProject: fetchActiveProject(http),
  updateProject: updateProject(http),
  create: create(http),
  fetchAllProjects: fetchAllProjects(http),
  isAdmin: isAdmin(http),
  delete: deleteProject(http),
  addUser: addUser(http),
  removeUser: removeUser(http),
});
