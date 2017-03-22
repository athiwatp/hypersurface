var responses = null

var firstResponse = []

export default {
  respond (data) {
    if (localStorage.getItem('responses') !== null) {
      responses = JSON.parse(localStorage.getItem('responses'))
      responses.push(data)
      localStorage.setItem('responses', JSON.stringify(responses))
    } else {
      firstResponse.push(data)
      localStorage.setItem('responses', JSON.stringify(firstResponse))
    }
  },
  checkResponse (data) {
    if (localStorage.getItem('responses') !== null) {
      responses = JSON.parse(window.localStorage.getItem('responses'))
      if (responses.indexOf(data) !== -1) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  },
  remove () {
    localStorage.removeItem('responses')
  }
}
