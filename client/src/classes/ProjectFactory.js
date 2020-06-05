export class Basic {
  constructor({ name, admin, password }) {
    this.type = 'basic';
    this.name = name;
    this.admin = admin;
    this.members = [];
    this.password = password;
    this.lists = [
      { name: 'To Do', data: [] },
      { name: 'In Progress', data: [] },
      { name: 'Done', data: [] },
    ];
    this.timestamp = Date.now();
  }
}

export class Kanban extends Basic {
  constructor(data) {
    super(data);
    this.type = 'kanban';
    this.lists = [
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
