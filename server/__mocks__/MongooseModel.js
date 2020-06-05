module.exports = a => {
  const defaults = {
    findOne: jest.fn(),
    find: jest.fn(),
    findOneAndRemove: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  return Object.assign(defaults, a);
};
