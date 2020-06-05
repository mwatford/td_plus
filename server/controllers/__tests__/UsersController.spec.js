const Controller = require('../users/controller');

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

  describe('currentUser', () => {
    test('return 200, user for valid argument', async () => {
      Models.User.findOne.mockImplementationOnce(() =>
        Promise.resolve({ name: 'test user', email: 'user@test.com' })
      );
      const actual = await controller.currentUser({ sub: '123' });

      expect(actual).toMatchObject({
        status: 200,
        data: {
          user: {
            name: 'test user',
          },
          message: { type: 'success', message: 'Logged in' },
        },
      });
    });

    test('returns status 500 if no user is found', async () => {
      Models.User.findOne.mockImplementationOnce(() => Promise.resolve(null));

      const actual = await controller.currentUser({ sub: '22' });

      expect(actual).toMatchObject({
        status: 500,
        data: { message: { type: 'error', message: 'Error trying to log in' } },
      });
    });
  });

  describe('searchByEmail', () => {
    test('returns 200, users', async () => {
      const actual = await controller.searchByEmail({ email: 'user@test.com' });

      expect(actual).toMatchObject({
        status: 200,
        data: {},
      });
    });
  });

  describe('delete', () => {
    test('returns status 200 on success ', async () => {
      const save = jest.fn();
      const chain = (() => {
        const c = {};
        c.where = jest.fn().mockReturnValue(c);
        c.in = jest.fn().mockReturnValue(c);
        c.exec = jest.fn(() => [
          { members: [], save },
          { members: [], save },
        ]);
        return c;
      })();
      Models.User.findOne.mockImplementationOnce(() =>
        Promise.resolve({ projects: [1, 2, 3] })
      );
      Models.Project.find.mockImplementationOnce(() => chain);

      const actual = await controller.delete({ sub: '11' });

      expect(actual).toMatchObject({ status: 200 });
    });
  });

  describe('update', () => {
    test('returns 200, updated user', async () => {
      Models.User.findByIdAndUpdate.mockImplementationOnce(() =>
        Promise.resolve({ name: 'test name' })
      );
      const actual = await controller.update({
        id: '11',
        changes: { name: '123' },
      });

      expect(actual).toMatchObject({
        status: 200,
        data: { name: 'test name' },
      });
    });
  });
});
