module.exports = (services, manager) => http =>
  (async () => {
    try {
      const io = require("socket.io")(http);
      const { projectService } = services;

      io.on("connection", async socket => {
        // console.log("user connected");

        const project = await projectService.find(
          socket.handshake.query.project
        );

        const user = project.members.find(
          el => el.id == socket.handshake.query.user
        );

        const usera = require("../../modules/UserFactory")(user);

        manager.create(project.name);

        socket.join(project.name);
        manager.addUser(usera, project.name);

        manager.get(project.name).users;
        // room.addUser(usera);
        socket.on("load messages", () => {
          socket.emit("message", manager.get(project.name).messages);
        });

        socket.on("sendMessage", data => {
          if (usera.write) {
            // console.log(usera);
            usera.write(data, manager.get(project.name));
            console.log(manager.get(project.name).messages);
            io.to(project.name).emit("message", {
              user: user.id,
              text: data
            });
          }
        });


        socket.on("disconnect", () => {
          manager.get(project.name).removeUser(usera);
          if (manager.get(project.name).empty) {
            manager.delete(project.name);
          }
        });
      });
    } catch (e) {
      console.log(e);
    }
  })();

// module.exports = (services, manager) => {
//   return {
//     init: init(services, manager)
//   };
// };
