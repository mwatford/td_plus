import axios from 'axios';

const fetchUsers = () =>
  axios({
    method: 'get',
    url: '/api/fake/users',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(({ data }) => {
    console.log({ data });
  });

const loginWithPopup = () => {
  return fetchUsers();
};

export default {
  loginWithPopup,
};
