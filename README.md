# td_plus - in progress
## https://td-plus.herokuapp.com

Fullstack todo app build that allows for creating your own editable projects/lists.
The app works without the need for logging in, but it's utility is limited in this mode. Creating an account let's you store your projects in a database, create projects with passwords, manage project members, dispatch tasks to specific users, chat with members. The link will take you to a preview of the app where you can choose a user u want to login as for the demo without the need to create account and submitting your personal data, since the main version uses Auth0 for account creation and verification . The 'heroku' branch is ahead of master and has some workarounds to disable the Auth0 token verification. The app is not responsive, at least yet.

## Tech stack:

- node.js with express
- mongoDB with mongoose
- Vuejs, Vuex, Vue-router
- socket.io - used for real time project management, and chat
- bcrypt - used for hashing project passwords

## To do:
- refactor components
- improvements to project management
- change the way local projects are stored (swap localStorage for indexedDB)
- add responsiveness
