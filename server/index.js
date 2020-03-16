const PORT = process.env.PORT || 8000;

(async () => {
  const app = await require("./app")();

  const http = require("http").createServer(app);

  http.listen(PORT, console.log(`Server running on port: ${PORT}`));

  require("./controllers/liveProject/index")(http);
})();
