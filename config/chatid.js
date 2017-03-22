export default {
  chatId () {
    var id = Math.floor((Math.random() * 1000000) + 1)
    localStorage.removeItem('chatid')
    localStorage.setItem('chatid', JSON.stringify(id))
  }
}
