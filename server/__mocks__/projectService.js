module.exports = {
  createProject: jest.fn(() =>
    Promise.resolve({ name: "asd", members: ["123"] })
  ),
  findMany: jest.fn(() => Promise.resolve(["test"])),
  find: jest.fn(() => Promise.resolve({ name: "asd" })),
  isMember: jest.fn(),
  isAdmin: jest.fn(),
  delete: jest.fn(() => ["123", "1234"])
};
