import { getInstance } from './index'
import store from '../store/index'

export const authGuard = (to, from, next) => {
  // const authService = getInstance();

  const fn = () => {
    // If the user is authenticated, continue with the route
    if (store.state.auth.status) {
      return next()
    }

    // Otherwise, log in
    next({ name: 'start' })
  }

  // If loading has already finished, check our auth state using `fn()`
  // if (!authService.loading) {}
  return fn()

  // Watch for the loading property to change before we check isAuthenticated
  // authService.$watch('loading', loading => {
  //   if (loading === false) {
  //     return fn();
  //   }
  // });
}
