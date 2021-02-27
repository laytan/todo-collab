export function auth({ feathers }) {
  return feathers.apiVuex.makeAuthPlugin({ userService: 'users' });
}
