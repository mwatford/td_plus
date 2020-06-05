const Controller = require('../projects/controller');

const Model = require('MongooseModel');

const Models = {
  User: Model(),
  Project: Model(),
};

const controller = Controller(Models);

describe('project controller', () => {
  test('is defined', () => {
    expect(Controller).toBeDefined();
  });

  describe('create', () => {
    test('returns 201, project data on success', async () => {
      const save = jest.fn();
      Models.User.findOne.mockImplementationOnce(() =>
        Promise.resolve({ _id: '123', save, projects: [] })
      );
      const actual = await controller.create({
        sub: '123',
        project: { name: 'test project' },
      });

      expect(actual).toMatchObject({ status: 200 });
    });
  });
});
