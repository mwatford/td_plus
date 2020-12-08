module.exports = (services, manager) => http =>
  (async () => {
    try {
      const io = require('socket.io')(http);
      const { projectService } = services;

      io.on('connection', async socket => {
        const project = await projectService.find(
          socket.handshake.query.project
        );

        const user = project.members.find(
          el => el.id == socket.handshake.query.user
        );

        const chatUser = require('../../modules/UserFactory')(user);

        manager.create(project._id);

        socket.join(project._id);

        chat({ socket, chatUser, user, io, manager, project });
        manage({ socket, project, io, services });

        socket.on('disconnect', () => {
          manager.get(project._id).removeUser(chatUser);

          if (manager.get(project._id).empty) {
            manager.delete(project._id);
          }
        });
      });
    } catch (e) {
      console.log(e);
    }
  })();

const chat = ({ socket, chatUser, io, user, manager, project }) => {
  manager.addUser(chatUser, project._id);

  socket.on('load messages', () => {
    socket.emit('message', manager.get(project._id).messages);
  });

  socket.on('sendMessage', data => {
    if (chatUser.write) {
      chatUser.write(data, manager.get(project._id));

      io.to(project._id).emit('message', {
        user: user.id,
        text: data,
      });
    }
  });
};

const manage = ({ socket, io, project, services }) => {
  socket.on('user removed', id => {
    io.to(project._id).emit('removed', id);
  });

  socket.on('project deleted', () => {
    io.to(project._id).emit('project deleted');
  });

  socket.on('updated', async data => {
    const { projectService } = services;

    try {
      await projectService.update(project._id, data);
      io.to(project._id).emit('update project', data);
    } catch (e) {}
  });
};
