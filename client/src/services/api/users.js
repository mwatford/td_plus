const register = http => data =>
  http({ method: 'post', url: '/api/users/register', data });

const signIn = http => data =>
  http({ method: 'post', url: '/api/users/sign-in', data });

const fetchUser = http => token =>
  http({
    method: 'get',
    url: '/api/users/current',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

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
  register: register(http),
  signIn: signIn(http),
  fetchUser: fetchUser(http),
  updateUser: updateUser(http),
  deleteUser: deleteUser(http),
  searchByEmail: searchByEmail(http),
});
