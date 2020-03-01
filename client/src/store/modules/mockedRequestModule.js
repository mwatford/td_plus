const data = {
  user: {
    name: "Mark",
    email: "mark@mcnugget.com",
    projects: ["123", "1233"]
  }
};

const delay = (resolve, data, duration) => {
  setTimeout(() => {
    return resolve(data);
  }, duration);
};

const get = url =>
  new Promise((resolve, reject) => {
    switch (url) {
      case "/api/current_user":
        delay(resolve, data.user, 2000);
        break;
      default:
        "not found";
    }
  });

export default {
  get
};
