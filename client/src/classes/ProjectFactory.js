export class Basic {
  constructor({ name, admin, password, members = [], lists, _id }) {
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
    this.timestamp = Date.now();
  }
  save(fn) {
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

class Factory {
  constructor(templates) {
    this.templates = templates;
  }
  create(type, project = {}) {
    if (!type || !project) {
      throw new Error('missing function argument(s)');
    }
    if (!templates.hasOwnProperty(type)) {
      throw new Error(`given template was not found: '${type}'`);
    }
    return new this.templates[type](project);
  }
}

const templates = {
  basic: Basic,
  kanban: Kanban,
};

const factory = new Factory(templates);
Object.freeze(factory);

export default factory;

const cloneDeep = x => JSON.parse(JSON.stringify(x));
