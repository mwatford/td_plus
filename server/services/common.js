const create = Model => data => {
  if (!data) {
    throw new Error('Data was not passed!')
  }

  const instance = new Model(data)

  return instance.save()
}

module.exports = {
  create,
}
