const Controller = require('../../projects/controller')

const Model = require('MongooseModel')

const Models = {
  User: Model(),
  Project: Model(),
}

const controller = Controller(Models)

describe('project controller', () => {
  test('is defined', () => {
    expect(Controller).toBeDefined()
  })

  describe('create', () => {
    test('returns 201, project data on success', async () => {
      const save = jest.fn()
      Models.User.findOne.mockImplementationOnce(() =>
        Promise.resolve({ _id: '123', save, projects: [] })
      )
      const actual = await controller.create({
        sub: '123',
        project: { name: 'test project' },
      })

      expect(actual).toMatchObject({
        status: 201,
        data: { name: 'test project' },
      })
    })
  })

  describe('addUser', () => {
    test('is defined', () => {
      expect(controller.addUser).toBeDefined()
    })

    test('returns 200 on success', async () => {
      const save = jest.fn()
      Models.Project.findById.mockImplementationOnce(() =>
        Promise.resolve({ _id: 'test project id', members: [], save })
      )
      Models.User.findById.mockImplementationOnce(() =>
        Promise.resolve({ _id: 'test user id', projects: [], save })
      )

      const actual = await controller.addUser({
        id: 'test id',
        userId: 'test user id',
      })

      expect(actual).toMatchObject({
        status: 200,
        data: {
          _id: 'test project id',
          members: [{ id: 'test user id', role: 'basic', permissions: [] }],
        },
      })

      expect(save).toHaveBeenCalledTimes(2)
    })

    test('returns 404 if user is not found', async () => {
      Models.User.findById.mockImplementationOnce(() => Promise.resolve())

      const actual = await controller.addUser({
        id: 'test id',
        userId: 'test user id',
      })

      expect(actual).toMatchObject({ status: 404 })
    })

    test('retuns 404 if project is not found', async () => {
      Models.Project.findById.mockImplementationOnce(() => Promise.resolve())

      const actual = await controller.addUser({
        id: 'test id',
        userId: 'test user id',
      })

      expect(actual).toMatchObject({ status: 404 })
    })

    test('does not add already existing user', async () => {
      const save = jest.fn()
      Models.User.findById.mockImplementationOnce(() =>
        Promise.resolve({
          _id: {
            equals: () => true,
          },
          projects: [],
          save,
        })
      )
      Models.Project.findById.mockImplementationOnce(() =>
        Promise.resolve({
          _id: 'test project id',
          name: 'test name',
          members: [{ id: 'test user id' }],
          save,
        })
      )

      const actual = await controller.addUser({ _id: 'test user id' })

      expect(actual).toMatchObject({
        status: 200,
        data: {
          message: { type: 'info', message: 'User is already a member' },
        },
      })
    })
  })

  describe('removeUser', () => {
    test('is defined', () => {
      expect(controller.removeUser).toBeDefined()
    })

    test('returns 200, project on success', async () => {
      const save = jest.fn()
      Models.Project.findById.mockImplementationOnce(() =>
        Promise.resolve({
          _id: 'test project id',
          name: 'test name',
          members: [{ id: 'test user id' }],
          save,
        })
      )
      Models.User.findById.mockImplementationOnce(() =>
        Promise.resolve({
          _id: 'test user id',
          projects: ['test project id'],
          save,
        })
      )

      const actual = await controller.removeUser({
        id: 'test project id',
        userId: 'test user id',
      })

      expect(save).toHaveBeenCalledTimes(2)
      expect(actual).toMatchObject({
        status: 200,
        data: { _id: 'test project id', name: 'test name', members: [] },
      })
    })
  })
})
