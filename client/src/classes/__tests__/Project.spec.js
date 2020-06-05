import { Project } from '../ProjectFactory';

describe('Project', () => {
  describe('instance', () => {
    test('should have set a name', () => {
      const project = new Project({ name: 'asd' });

      expect(project.state).toMatchObject({ name: '22' });
    });

    test('should get updated', () => {
      const project = new Project({ aa: '22' });

      const updatedProject = new Project({ asd: 23 });

      project.update(updatedProject);

      expect(project.state).toMatchObject({ asd: 23 });
    });

    test('should not get updated if passed data is invalid', () => {
      const project = new Project({ aa: 22 });
      project.update({ aa: 23 });

      expect(project.state).toMatchObject({ aa: 22 });
    });
  });
});
