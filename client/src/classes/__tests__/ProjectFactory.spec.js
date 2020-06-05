import factory from '../ProjectFactory';
import { Basic, Kanban } from '../ProjectFactory';

describe('factory', () => {
  test('should return basic project', () => {
    const project = factory.create('basic', { name: 'test project' });

    const actual = project instanceof Basic;

    expect(actual).toBe(true);
  });

  describe('should throw error if', () => {
    test('no type is passed', () => {
      const project = {
        name: 'test',
      };

      expect(() => factory.create()).toThrow('missing function argument(s)');
    });

    test('type is not found', () => {
      const type = 'not-found';
      const project = { name: 'test' };

      expect(() => factory.create(type, project)).toThrow(
        "given template was not found: 'not-found'"
      );
    });
  });

  test('should return kanban project', () => {
    const type = 'kanban';
    const project = factory.create(type, {
      name: 'test project',
    });

    const actual = project instanceof Kanban;

    expect(actual).toBe(true);
    expect(project.name).toBe('test project');
  });
});
