const write = user => ({
  write: (data, room) => {
    room.addMessage({ user: user.id, text: data })
  },
})

const removeUser = user => ({
  removeUser: () => {
    console.log(`${user.name} can remove users.`)
  },
})

const factory = user => {
  const admin = () => Object.assign(user, write(user), removeUser(user))
  const basic = () => Object.assign(user, write(user))
  const custom = () =>
    Object.assign(user, ...user.permissions.map(el => eval(el)(user)))

  try {
    return eval(user.role)()
  } catch (e) {
    return 'error creating user'
  }
}

module.exports = factory
