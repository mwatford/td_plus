const getUsers = services => async () => {
  const { userService } = services;

  const users = await userService.get({}, '');

  return { status: 200, data: users };
};

module.exports = services => ({
  getUsers: getUsers(services),
});
