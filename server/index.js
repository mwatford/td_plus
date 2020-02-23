const PORT = process.env.PORT || 8000;

(async () => {
  const app = await require("./modules/app")();
  app.listen(PORT, console.log(`Server running on port: ${PORT}`));
})();
