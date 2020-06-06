import { Basic } from '../../projects';

const members = [
  { id: 'test id 1', name: 'adam' },
  { id: 'test id 2', name: 'Mark' },
];
describe('Project', () => {
  describe('instance', () => {
    test('should set a name', () => {
      const project = new Basic({ name: 'test' });

      expect(project).toMatchObject({ name: 'test' });
    });
  });

  describe('strip', () => {
    test('returns an object with data required in model', () => {
      const project = new Basic({ name: '22', members });

      const result = project.strip();

      expect(result.members).toEqual([
        { id: 'test id 1', permissions: undefined, role: undefined },
        { id: 'test id 2', permissions: undefined, role: undefined },
      ]);
    });
  });

  describe('save', () => {
    test("should call cb function with 'stripped' project", () => {
      const project = new Basic({ name: 'test', members });
      const cb = jest.fn();

      const stripped = project.strip();
      project.save(cb);

      expect(cb).toHaveBeenCalledWith(stripped);
    });
  });

  describe('removeMember', () => {
    test('removes member with specified id', () => {
      const member1 = { id: '1' };
      const member2 = { id: '2' };

      const project = new Basic({
        name: 'test',
        members: [member1, member2],
      });

      project.removeMember('1');

      const actual = project.members.indexOf(member1) === -1;

      expect(actual).toBeTruthy();
    });
  });
});
