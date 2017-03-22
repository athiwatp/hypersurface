export default {
  checkForStorage (context) {
    try {
      localStorage.test = null;
    } catch (e) {
      context.$parent.help('No storage')
    }
  },
  saveName(context, data) {
    localStorage.setItem('user', JSON.stringify(data))
    context.$root.username = JSON.parse(localStorage.getItem('user'))
  },
  stayLoggedIn () {
    if (localStorage.getItem('user')) {
      localStorage.setItem('loggedIn', 'yes')
    }
  },
  logout() {
    localStorage.removeItem('user')
    localStorage.removeItem('loggedIn')
  }
}
