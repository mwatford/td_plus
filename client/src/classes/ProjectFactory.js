import { Basic, Kanban } from './projects'

class Factory {
  constructor(templates) {
    this.templates = templates
  }
  create(type, project = {}) {
    if (!type || !project) {
      throw new Error('missing function argument(s)')
    }
    if (!templates.hasOwnProperty(type)) {
      throw new Error(`given template was not found: '${type}'`)
    }
    return new this.templates[type](project)
  }
}

const templates = {
  basic: Basic,
  kanban: Kanban,
}

const factory = new Factory(templates)
Object.freeze(factory)

export default factory
