const fetchUser = http => token => {
  return http({
    method: 'get',
    url: '/api/users/current',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

export default http => ({
  fetchUser: fetchUser(http),
});
