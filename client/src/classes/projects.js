const cloneDeep = x => JSON.parse(JSON.stringify(x));

export class Basic {
  constructor({ name, admin, password, members = [], lists, _id, ...rest }) {
    this._id = _id;
    this.type = 'basic';
    this.name = name;
    this.admin = admin;
    this.members = members;
    this.password = password;
    this.lists = lists || [
      { name: 'To Do', data: [] },
      { name: 'In Progress', data: [] },
      { name: 'Done', data: [] },
    ];
    this.timestamp = rest.timestamp || Date.now();
  }
  save({ fn }) {
    return fn(this.strip());
  }
  strip() {
    const copy = cloneDeep(this);

    copy.members = this.members.map(el => ({
      id: el.id,
      role: el.role,
      permissions: el.permissions,
    }));

    return copy;
  }
  removeMember({ id }) {
    const member = this.members.find(el => el.id === id);

    if (member) {
      const index = this.members.indexOf(member);
      this.members.splice(index, 1);
    }
  }
  addMember({ member }) {
    if (!this.isMember(member)) this.members.push(member);
  }
  isMember({ id }) {
    return this.members.find(el => el.id === id) ? true : false;
  }
  addTask({ task, listIndex }) {
    if (!this.lists[listIndex]) return false;
    if (!task || typeof task === 'string' || typeof task === 'number')
      return false;

    this.lists[listIndex].data.push(task);
  }
  moveTask({ id, from, to }) {
    if (from === to) return;

    const item = this.lists[from].data.find(el => el.id === id);

    if (item) {
      const task = this.lists[from].data.splice(item, 1);
      this.lists[to].data.push(...task);
    }
  }
  addList({ name }) {
    if (!this.lists.find(el => el.name === name))
      this.lists.push({ data: [], name });
  }
}

export class Kanban extends Basic {
  constructor(data) {
    super(data);
    this.type = 'kanban';
    this.lists = data.lists || [
      { name: 'Backlog', data: [] },
      { name: 'Design', data: [] },
      { name: 'To Do', data: [] },
      { name: 'In Progress', data: [] },
      { name: 'Code Review', data: [] },
      { name: 'Testing', data: [] },
      { name: 'Done', data: [] },
    ];
  }
}
