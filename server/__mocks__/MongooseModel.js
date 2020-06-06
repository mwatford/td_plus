module.exports = a => {
  const defaults = {
    create: jest.fn(x => Promise.resolve(x)),
    findOne: jest.fn(),
    find: jest.fn(),
    findOneAndRemove: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  return Object.assign(defaults, a);
};
