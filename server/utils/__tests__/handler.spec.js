const handler = require('../handler')
const res = require('response')

describe('handler test', () => {
  test('is defined', () => {
    expect(handler).toBeDefined()
  })

  const promise = jest.fn(() =>
    Promise.resolve({ status: 200, data: { name: 'asd' } })
  )
  const req = {
    user: {
      id: 'test user id',
    },
  }
  const params = jest.fn((req, res, next) => {
    return {
      id: req.user.id,
    }
  })
  const next = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('if callback was passed', () => {
    test('calls callback', async () => {
      const mockRes = res()

      await handler(promise, params)(req, mockRes, next)

      expect(params).toHaveBeenCalledWith(req, mockRes, next)
    })

    test('calls promise with correct arguments', async () => {
      const mockRes = res()

      await handler(promise, params)(req, mockRes, next)

      expect(promise).toHaveBeenCalled()
      expect(promise).toHaveBeenCalledWith({ id: req.user.id })
    })

    test('calls status with response.status', async () => {
      const mockRes = res()
      await handler(promise, params)(req, mockRes, next)

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.send).toHaveBeenCalledWith({ name: 'asd' })
    })
  })

  describe('if callback was not passed', () => {
    test('calls promise with empty object', async () => {
      const mockRes = res()

      await handler(promise)(req, mockRes, next)

      expect(params).not.toHaveBeenCalled()
      expect(promise).toHaveBeenCalledWith({})
    })
  })

  describe('if error', () => {
    test('calls res.status with 500 and next with error', async () => {
      const mockRes = res()
      const error = new Error('test error')
      promise.mockImplementationOnce(() => {
        throw error
      })

      handler(promise)(req, mockRes, next)

      expect(mockRes.status).toHaveBeenCalledWith(500)
      expect(next).toHaveBeenCalledWith(error)
    })
  })
})
