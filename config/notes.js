var notes = null

var firstNote = []

export default {
  saveNote(data) {
    if (localStorage.getItem('notes') !== null) {
      notes = JSON.parse(localStorage.getItem('notes'))
      for (let value of notes) {
        if (value.question === data.question) {
          notes.splice(value, 1)
        }
      }
      notes.push(data)
      localStorage.setItem('notes', JSON.stringify(notes))
    } else {
      firstNote.push(data)
      localStorage.setItem('notes', JSON.stringify(firstNote))
    }
  }
}
