import http from '../../api/users'
import _ from 'lodash'

const factory = (method, url, token, data) => {
  const defaults = {
    method,
    url,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }

  if (data) _.defaultsDeep(defaults, { data })
  if (!data) delete defaults.headers['Content-Type']

  return defaults
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('users api', () => {
  const apiModule = jest.fn()
  const instance = http(apiModule)

  test('is defined', () => {
    expect(http).toBeDefined()
  })

  describe('correctly calls', () => {
    test('fetchUser', () => {
      const expected = factory('get', '/api/users/current', 'test token')

      instance.fetchUser('test token')

      expect(apiModule).toHaveBeenCalledWith(expected)
    })

    test('updateUser', () => {
      const changes = { name: 'test name' }
      const expected = factory(
        'put',
        '/api/users/current',
        'test token',
        changes
      )

      instance.updateUser('test token', changes)

      expect(apiModule).toHaveBeenCalledWith(expected)
    })

    test('deleteUser', () => {
      const expected = factory('delete', '/api/users/current', 'test token')

      instance.deleteUser('test token')

      expect(apiModule).toHaveBeenCalledWith(expected)
    })

    test('searchByEmail', () => {
      const expected = factory(
        'get',
        '/api/users/search/test@email.com',
        'test token'
      )

      instance.searchByEmail('test token', 'test@email.com')

      expect(apiModule).toHaveBeenCalledWith(expected)
    })
  })
})
