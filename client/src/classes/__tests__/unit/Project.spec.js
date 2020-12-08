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
      project.save({ fn: cb });

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

      project.removeMember({ id: '1' });

      const result = project.members.indexOf(member1) === -1;

      expect(result).toBeTruthy();
    });
  });

  describe('addMember', () => {
    test('adds provided member', () => {
      const member = { id: '1' };
      const project = new Basic({ name: 'test' });

      project.addMember({ member });

      const result = project.members.indexOf(member) === -1;

      expect(result).toBeFalsy();
    });

    test('does not add already existing members', () => {
      const members = [{ id: '1' }, { id: '2' }, { id: '3' }];
      const project = new Basic({ name: 'test', members });

      project.addMember({ member: { id: '1' } });

      const result = project.members.length;

      expect(result).toEqual(3);
    });
  });

  describe('moveTask', () => {
    const project = new Basic({ name: 'test' });
    test('is defined', () => {
      expect(project.moveTask).toBeDefined();
    });

    test('moves a task from one list to another', () => {
      project.lists[0].data.push({ id: 'task id' });

      project.moveTask({ id: 'task id', from: 0, to: 2 });

      const result = project.lists[0].data.length === 0;
      const result2 = project.lists[2].data.length === 1;

      expect(result).toBeTruthy();
      expect(result2).toBeTruthy();
    });

    test('does not move a task if list is the same', () => {
      project.lists[2].data.push({ id: 'task 2 id' });

      project.moveTask({ id: 'task id', from: 2, to: 2 });

      const length = project.lists[2].data.length;
      const element = project.lists[2].data.find(el => el.id === 'task id');
      const index = project.lists[2].data.indexOf(element);

      expect(length).toEqual(2);
      expect(index).toEqual(0);
    });
  });

  describe('isMember', () => {
    const project = new Basic({
      name: 'test',
      members: [{ id: 'test id' }, { id: 'test id 2' }],
    });

    test('is defined', () => {
      expect(project.isMember).toBeDefined();
    });

    test('returns true if member is found', () => {
      const result = project.isMember({ id: 'test id' });
      const result2 = project.isMember({ id: 'test id 2' });

      expect(result).toBe(true);
      expect(result2).toBe(true);
    });

    test('returns false if member is not found', () => {
      const result = project.isMember({ id: 'test id 3' });

      expect(result).toBe(false);
    });
  });

  describe('addTask', () => {
    const project = new Basic({ name: 'test' });

    test('is defined', () => {
      expect(project.addTask).toBeDefined();
    });

    test('add a task to given list', () => {
      project.addTask({ task: {}, listIndex: 0 });
      project.addTask({ task: {}, listIndex: 1 });

      const result = project.lists[0].data.length === 1;
      const result2 = project.lists[1].data.length === 1;

      expect([result, result2]).toEqual([true, true]);
    });

    test('returns false if list does not exist', () => {
      const results = [];

      results.push(project.addTask({ task: {}, listIndex: 7 }));
      results.push(project.addTask({ task: {}, listIndex: 3 }));

      expect(results).toEqual([false, false]);
    });

    test('returns false if task is of primitive type', () => {
      const results = [];

      results.push(project.addTask({ task: 1, listIndex: 0 }));
      results.push(project.addTask({ task: 'a', listIndex: 0 }));
      results.push(project.addTask({ task: undefined, listIndex: 0 }));
      results.push(project.addTask({ task: null, listIndex: 0 }));

      expect(results).toEqual([false, false, false, false]);
    });
  });
});
