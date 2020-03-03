const PORT = process.env.PORT || 8000;

(async () => {
  const app = await require("./app")();

  const http = require("http").createServer(app);

  http.listen(PORT, console.log(`Server running on port: ${PORT}`));

  const io = require("socket.io")(http);

  io.on("connection", socket => {
    console.log("asd");
    socket.on("disconnect", () => {
      console.log("dc");
    });
  });
})();
