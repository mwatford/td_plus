import axios from 'axios';

export const sendProjects = (projects, token) => {
  return axios({
    method: 'post',
    url: '/api/projects/import',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: {
      projects,
    },
  }).catch(e => {});
};
