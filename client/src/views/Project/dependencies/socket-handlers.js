export function initListeners() {
  this.$socket.on('update-project', this.updateProject)

  this.$socket.on('removed', id => {
    if (id === this.user._id) {
      this.alert('info', 'You have been removed from the project.')
      this.navigate({ name: 'home' })
    }
  })

  this.$socket.on('project-deleted', () => {
    this.alert('info', 'Project you had open, has been deleted.')
    this.navigate({ name: 'home' })
  })
}

export async function connect() {
  return this.$socket.connect({
    query: {
      user: this.user._id,
      project: this.project._id,
    },
  })
}

export async function emitUpdate() {
  this.$socket.emit('updated', this.project)
}

export default { initListeners, connect, emitUpdate }
