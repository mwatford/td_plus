function RoomManager() {
  const ROOMS = {};
  this.showRooms = () => {
    console.log(ROOMS);
  };
  this.create = name => {
    if (!ROOMS[name]) ROOMS[name] = roomFactory();
  };
  this.get = name => {
    return ROOMS[name];
  };
  this.delete = name => {
    delete ROOMS[name];
  };
  this.addUser = (user, room) => {
    ROOMS[room].addUser(user)
  };
}

const roomFactory = () => {
  const users = [];
  const messages = [];
  return {
    addUser(user) {
      users.push(user);
    },
    removeUser(user) {
      users.splice(user, 1);
    },
    addMessage(message) {
      messages.push(message);
    },
    get users() {
      console.log(users);
    },
    get messages() {
      return messages;
    },
    get empty() {
      return users.length ? false : true;
    }
  };
};

const Singleton = (() => {
  let instance;

  function createRoomManager() {
    instance = new RoomManager();
    return instance;
  }

  return {
    getRoomManager() {
      if (!instance) {
        instance = createRoomManager();
      }
      return instance;
    }
  };
})();

module.exports = Singleton;
