module.exports = {
  find: jest.fn(),
  createUser: jest.fn(x => Promise.resolve({ email: x.email, sub: x.sub })),
  updateUser: jest.fn((user, x) => Promise.resolve(user)),
  get: jest.fn(() => [{ a: "a" }, { b: "b" }]),
  updateUsers: jest.fn()
};
