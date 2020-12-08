const fetchUser = http => token => {
  return http({
    method: 'get',
    url: '/api/users/current',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const updateUser = http => (token, changes) =>
  http({
    method: 'put',
    url: '/api/users/current',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: changes,
  });

const deleteUser = http => token =>
  http({
    method: 'delete',
    url: '/api/users/current',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const searchByEmail = http => (token, query) =>
  http({
    method: 'get',
    url: `/api/users/search/${query}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export default http => ({
  fetchUser: fetchUser(http),
  updateUser: updateUser(http),
  deleteUser: deleteUser(http),
  searchByEmail: searchByEmail(http),
});
