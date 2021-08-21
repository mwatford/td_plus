const cloneDeep = x => JSON.parse(JSON.stringify(x))

export class Basic {
  constructor({ name, admin, password, members = [], lists, _id, ...rest }) {
    this._id = _id
    this.type = 'basic'
    this.name = name
    this.admin = admin
    this.members = members
    this.password = password
    this.lists = lists || [
      { name: 'To Do', data: [] },
      { name: 'In Progress', data: [] },
      { name: 'Done', data: [] },
    ]
    this.timestamp = rest.timestamp || Date.now()
  }
  save(fn) {
    return fn(this.strip())
  }
  strip() {
    const copy = cloneDeep(this)

    copy.members = this.members.map(el => ({
      id: el.id,
      role: el.role,
      permissions: el.permissions,
    }))

    return copy
  }
  removeMember({ id }) {
    const member = this.members.find(el => el.id === id)

    if (member) {
      const index = this.members.indexOf(member)
      this.members.splice(index, 1)
    }
  }
  addMember({ member }) {
    if (!this.isMember(member)) this.members.push(member)
  }
  isMember({ id }) {
    return this.members.find(el => el.id === id) ? true : false
  }
  addTask({ task, listIndex }) {
    if (!this.lists[listIndex]) return false
    if (!task || typeof task === 'string' || typeof task === 'number')
      return false

    this.lists[listIndex].data.push(task)
  }
  moveTask({ id, from, to, timestamp }) {
    if (from === to) return

    console.log(timestamp)

    const item = id
      ? this.lists[from].data.findIndex(el => el._id === id)
      : this.lists[from].data.findIndex(el => el.timestamp === timestamp)

    if (typeof item !== 'undefined' && this._listExists(to)) {
      const task = this.lists[from].data.splice(item, 1)
      this.lists[to].data.push(...task)
    }
  }
  updateTask({ id, listIndex, changes }) {
    const item = this.lists[listIndex].data.find(el => el._id === id)

    if (item) {
      Object.assign(item, changes)
    }
  }
  addList({ name }) {
    if (!this.lists.find(el => el.name === name))
      this.lists.push({ data: [], name })
  }
  editListName({ index, name }) {
    if (this._listExists(index)) this.lists[index].name = name
  }
  deleteList({ index }) {
    if (this._listExists(index)) this.lists.splice(index, 1)
  }
  _listExists(index) {
    return this.lists[index]
  }
}

export class Kanban extends Basic {
  constructor(data) {
    super(data)
    this.type = 'kanban'
    this.lists = data.lists || [
      { name: 'Backlog', data: [] },
      { name: 'Design', data: [] },
      { name: 'To Do', data: [] },
      { name: 'In Progress', data: [] },
      { name: 'Code Review', data: [] },
      { name: 'Testing', data: [] },
      { name: 'Done', data: [] },
    ]
  }
}
