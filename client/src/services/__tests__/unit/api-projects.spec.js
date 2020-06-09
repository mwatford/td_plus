import http from '../../api/projects';
import _ from 'lodash';

const factory = (method, url, token, data) => {
  const defaults = {
    method,
    url,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  if (data) _.defaultsDeep(defaults, { data });
  if (!data) delete defaults.headers['Content-Type'];

  return defaults;
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('projects api', () => {
  const apiModule = jest.fn();
  const instance = http(apiModule);

  test('is defined', () => {
    expect(http).toBeDefined();
  });

  describe('correctly calls', () => {
    test('import', () => {
      const projects = [{ name: 'test project' }];
      const expected = factory(
        'post',
        '/api/projects/import',
        'test token',
        projects
      );

      instance.import('test token', projects);

      expect(apiModule).toHaveBeenCalledWith(expected);
    });

    test('fetchActiveProject', () => {
      const expected = factory('get', '/api/projects/active/1', 'token');

      instance.fetchActiveProject('token', 1);

      expect(apiModule).toHaveBeenCalledWith(expected);
    });

    test('updateProject', () => {
      const changes = { name: 'test name' };
      const expected = factory('put', '/api/projects/1', 'test token', changes);

      instance.updateProject('test token', 1)(changes);

      expect(apiModule).toHaveBeenCalledWith(expected);
    });

    test('create', () => {
      const data = { name: 'test name' };
      const expected = factory(
        'post',
        '/api/projects/create',
        'test token',
        data
      );

      instance.create('test token', data);

      expect(apiModule).toHaveBeenCalledWith(expected);
    });

    test('fetchAllProjects', () => {
      const expected = factory('get', '/api/projects/all/1', 'test token');

      instance.fetchAllProjects('test token', 1);

      expect(apiModule).toHaveBeenCalledWith(expected);
    });

    test('isAdmin', () => {
      const expected = factory('get', '/api/projects/1/admin', 'test token');

      instance.isAdmin('test token', 1);

      expect(apiModule).toHaveBeenCalledWith(expected);
    });

    test('delete', () => {
      const expected = factory('delete', '/api/projects/1', 'test token');

      instance.delete('test token', 1);

      expect(apiModule).toHaveBeenCalledWith(expected);
    });

    test('addUser', () => {
      const expected = factory(
        'put',
        '/api/projects/1/addUser/1',
        'test token'
      );

      instance.addUser('test token', { id: 1, userId: 1 });

      expect(apiModule).toHaveBeenCalledWith(expected);
    });
  });
});
