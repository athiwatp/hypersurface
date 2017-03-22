var clips = null

var firstClip = []

var x = null

export default {
  addClip(clip) {
    if (localStorage.getItem('clips') !== null) {
      clips = JSON.parse(localStorage.getItem('clips'))
      if (clips.indexOf(clip) === -1) {
        clips.push(clip)
        localStorage.setItem('clips', JSON.stringify(clips))
      } else {
        return
      }
    }
    else {
      firstClip.push(clip)
      localStorage.setItem('clips', JSON.stringify(firstClip))
    }
  },
  removeClip(clip) {
    clips = JSON.parse(localStorage.getItem('clips'))
    if (clips.indexOf(clip) !== -1) {
      clips.splice(value, 1)
      localStorage.setItem('clips', JSON.stringify(clips))
    }
  },
  removeAll () {
    localStorage.removeItem('clips')
  }
}
