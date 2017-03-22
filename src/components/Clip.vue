<template>
  <div class="clip-main">
    <div class="label">
      <h2 class="title">{{activeClip | space | cut | cap}}?</h2>
      <button class="menu-btn show-menu-btn" @click="showMenu()">
        <i class="fa fa-list-alt"></i> {{menuText}} menu
      </button>
      <button class="menu-btn goto-btn" @click="goToPoll()">
        <i class="fa fa-paper-plane"></i>
      </button>
    </div>
    <div class="clip-buttons">
      <transition name="fade" mode="out-in">
        <button class="s-c save" v-show="menu" @click="saveNote()">Save note</button>
      </transition>
      <transition name="fade" mode="out-in">
        <button class="s-c clear" v-show="menu" @click="clearBoard()">Clear note</button>
      </transition>
    </div>
    <transition name="fade" mode="out-in">
      <div class="count" v-show="menu">
        <span>{{words}}</span>
        <p>Words</p>
        <span>{{paragraphs}}</span>
        <p>Paragraphs</p>
        <span>{{characters}}</span>
        <p class="mb0">Characters</p>
      </div>
    </transition>
    <div class="textarea" autofocus="" contenteditable="" ref="textarea"></div>
    <transition name="fade" mode="out-in">
      <div class="menu" v-show="menu">
        <div class="button-box" v-show="!hideButtons">
          <button class="bold menu-icon" @click="bold()">
            <i class="fa fa-bold"></i>
          </button>
          <button class="strikethrough menu-icon" @click="strikethrough()">
            <i class="fa fa-strikethrough"></i>
          </button>
          <button class="link menu-icon" @click="addlink()">
            <i class="fa fa-link"></i>
          </button>
          <button class="unlink menu-icon" @click="unlink()">
            <i class="fa fa-chain-broken"></i>
          </button>
          <button class="italic menu-icon" @click="italic()">
            <i class="fa fa-italic"></i>
          </button>
          <button class="underline menu-icon" @click="underline()">
            <i class="fa fa-underline"></i>
          </button>
          <button class="font-name menu-icon" @click="changeFN()">
            <i class="fa fa-font"></i>
          </button>
          <button class="font-size menu-icon" @click="changeFS()">
            <i class="fa fa-plus"></i>
          </button>
          <button class="image menu-icon" @click="addPhoto()">
            <i class="fa fa-photo"></i>
          </button>
          <button class="color menu-icon" @click="changeColor()">
            <i class="fa fa-adjust"></i>
          </button>
          <button class="list menu-icon" @click="addUnorderedList()">
            <i class="fa fa-list-ul"></i>
          </button>
          <button class="order menu-icon" @click="addOrderedList()">
            <i class="fa fa-list-ol"></i>
          </button>
          <button class="center menu-icon" @click="center()">
            <i class="fa fa-align-center"></i>
          </button>
          <button class="justify menu-icon" @click="justify()">
            <i class="fa fa-align-justify"></i>
          </button>
          <button class="left menu-icon" @click="left()">
            <i class="fa fa-align-left"></i>
          </button>
          <button class="right menu-icon" @click="right()">
            <i class="fa fa-align-right"></i>
          </button>
          <button class="undo menu-icon" @click="undo()">
            <i class="fa fa-undo"></i>
          </button>
          <button class="redo menu-icon" @click="redo()">
            <i class="fa fa-repeat"></i>
          </button>
        </div>
        <p class="link-txt" v-show="hideButtons">{{hiddenButtonText}}</p>
        <input class="linkHref" autofocus="" v-show="link" v-model="href"/>
        <input class="linkHref" autofocus="" v-show="fontName" v-model="name"/>
        <input class="linkHref" autofocus="" v-show="fontSize" v-model="size"/>
        <input class="linkHref" autofocus="" v-show="fontColor" v-model="color"/>
        <input class="linkHref" autofocus="" v-show="photo" v-model="photoUrl"/>
        <button class="submit-btn" v-show="link" @click="createLink()">Add link</button>
        <button class="submit-btn" v-show="fontName" @click="fontFamily()">Change</button>
        <button class="submit-btn" v-show="fontSize" @click="scaleSize()">Scale</button>
        <button class="submit-btn" v-show="fontColor" @click="newColor()">Change</button>
        <button class="submit-btn" v-show="photo" @click="insertPhoto()">Add photo</button>
      </div>
    </transition>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Notes from '../../config/notes'
  import Countable from 'countable'
  import $ from 'jquery'
  import _ from 'lodash'

  require('../../node_modules/jquery-ui/ui/widgets/draggable')
  require('../../node_modules/jquery-ui/ui/widgets/resizable')

  Vue.filter('space', function (value) {
    return value.replace(/\-/g, ' ') // eslint-disable-line no-useless-escape
  })

  Vue.filter('cut', function (value) {
    return _.trimStart(value, '/')
  })

  Vue.filter('cap', function (value) {
    return _.capitalize(value)
  })
  export default {
    data () {
      return {
        menu: true,
        link: false,
        href: '',
        fontName: false,
        name: '',
        fontSize: false,
        size: '',
        fontColor: false,
        color: '',
        photo: false,
        photoUrl: '',
        hideButtons: false,
        paragraphs: 0,
        sentences: 0,
        words: 0,
        characters: 0,
        all: 0
      }
    },
    computed: {
      activeClip: function () {
        if (this.$parent.currentClip !== null) {
          return this.$parent.currentClip
        } else {
          return ''
        }
      },
      hiddenButtonText: function () {
        if (this.link) {
          return 'Enter the url:'
        }
        if (this.fontName) {
          return 'Enter a font name:'
        }
        if (this.fontSize) {
          return 'Enter a size (1-7):'
        }
        if (this.fontColor) {
          return 'Enter a color:'
        }
        if (this.photo) {
          return 'Enter photo url:'
        }
        return ''
      },
      menuText () {
        if (this.menu === true) {
          return 'Hide'
        } else {
          return 'Show'
        }
      }
    },
    methods: {
      showMenu () {
        if (this.menu === true) {
          this.menu = false
        } else {
          this.menu = true
        }
      },
      goToPoll () {
        this.$router.push(this.$parent.currentClip)
      },
      bold () {
        document.execCommand('bold')
      },
      strikethrough () {
        document.execCommand('strikeThrough')
      },
      addlink () {
        this.link = true
        this.hideButtons = true
      },
      createLink () {
        document.execCommand('CreateLink', false, this.href)
        this.href = ''
        this.link = false
        this.hideButtons = false
      },
      unlink () {
        document.execCommand('unlink')
      },
      italic () {
        document.execCommand('italic')
      },
      underline () {
        document.execCommand('underline')
      },
      changeFN () {
        this.fontName = true
        this.hideButtons = true
      },
      fontFamily () {
        document.execCommand('fontName', false, this.name)
        this.name = ''
        this.fontName = false
        this.hideButtons = false
      },
      changeFS () {
        this.fontSize = true
        this.hideButtons = true
      },
      scaleSize () {
        document.execCommand('fontSize', false, this.size)
        this.size = ''
        this.fontSize = false
        this.hideButtons = false
      },
      changeColor () {
        this.fontColor = true
        this.hideButtons = true
      },
      newColor () {
        document.execCommand('foreColor', false, this.color)
        this.color = ''
        this.fontColor = false
        this.hideButtons = false
      },
      addPhoto () {
        this.photo = true
        this.hideButtons = true
      },
      insertPhoto () {
        document.execCommand('insertImage', false, this.photoUrl)
        this.photoUrl = ''
        this.photo = false
        this.hideButtons = false
      },
      addUnorderedList () {
        document.execCommand('insertUnorderedList')
      },
      addOrderedList () {
        document.execCommand('insertOrderedList')
      },
      center () {
        document.execCommand('justifyCenter')
      },
      justify () {
        document.execCommand('justifyFull')
      },
      left () {
        document.execCommand('justifyLeft')
      },
      right () {
        document.execCommand('justifyRight')
      },
      undo () {
        document.execCommand('undo')
      },
      redo () {
        document.execCommand('redo')
      },
      clearBoard () {
        $('.textarea').empty()
        this.paragraphs = 0
        this.characters = 0
        this.words = 0
      },
      saveNote () {
        var data = {
          question: this.activeClip,
          note: $('.textarea').html()
        }
        Notes.saveNote(data)
        this.$parent.help('saved note')
      },
      loadNote () {
        $('.textarea').html('')
        if (window.localStorage.getItem('notes') !== null) {
          for (let value of JSON.parse(window.localStorage.getItem('notes'))) {
            if (this.activeClip === value.question) {
              $('.textarea').html(value.note)
            }
          }
        }
      }
    },
    watch: {
      'activeClip': 'loadNote'
    },
    mounted: function () {
      this.loadNote()

      $(document).ready(function () {
        $('.menu').draggable()
      })

      var area = this.$refs.textarea

      var options = {
        stipTag: true
      }

      var that = this

      function callback (counter) {
        that.paragraphs = counter.paragraphs
        that.sentences = counter.sentences
        that.words = counter.words
        that.characters = counter.characters
        that.all = counter.all
      }

      Countable.live(area, callback, options)
    }
  }
</script>
<style scoped>
  ::-webkit-scrollbar {
    width: 4px;
    height: 2px;
  }

  ::-webkit-scrollbar-thumb {
    background: transparent;
    -webkit-border-radius: 5px;
    border-radius: 5px;
  }

  a, a:visited {
    color: #ff3344;
    cursor: pointer;
    text-decoration: underline;
  }

  .label {
    position: absolute;
    top: 13%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -13%);
    text-align: center;
    max-width: 50%;
  }

  .title {
    font-family: 'Lato', sans-serif;
    font-size: 18px;
    font-weight: normal;
    color: #fff;
    margin: 0;
    display: inline;
    margin-right: 10px;
  }

  .menu-btn {
    margin: 0;
    padding: 10px;
    border: 0;
    border-radius: 5px;
    background-color: rgba(255,99,132,1);
    display: inline-block;
    cursor: pointer;
    font-family: 'Lato', sans-serif;
    font-size: 15px;
    color: #fff;
  }

  .menu-btn i {
    color: yellow;
    font-size: 15px;
    margin-right: .5rem;
  }

  .goto-btn {
    background-color: rgba(54, 162, 235, 1);
  }

  .goto-btn i {
    color: #fff;
    text-align: center;
    margin: 0;
  }

  .menu-btn:active {
    box-shadow: inset 0px -2px 7px rgba(0,0,0,.34);
  }

  .clip-buttons {
    position: absolute;
    top: 82%;
    display: table;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
  }

  .s-c {
    display: table-cell;
    vertical-align: middle;
    font-family: 'Lato', sans-serif;
    font-size: 15px;
    color: rgba(255, 255, 255, 0.5);
    padding: 10px;
    border: 2px solid;
    border-radius: 5px;
    background-color: transparent;
    cursor: pointer;
    transition: all .3s ease-in-out;
  }

  .save {
    margin-right: 1rem;
  }

  .clear {
  }

  .save:hover, .clear:hover {
    color: rgba(255, 255, 255, 1);
    border: 2px solid #fff
  }

  .count {
    position: absolute;
    top: 50%;
    left: 93.5%;
    transform: translate(-91.5%, -50%);
    text-align: center;
    font-family: 'Lato',sans-serif;
    color: #fff;
  }

  .count span {
    font-size: 2rem;
  }

  .count p {
    font-size: 18px;
    margin-bottom: 40px;
  }

  .count .mb0 {
    margin-bottom: 0;
  }

  .textarea {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.45);
    padding: 10px;
    padding-right: 8px;
    font-size: 18px;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif;
    background-color: rgba(0, 171, 108, .7);
    border: 0;
    border-radius: 5px;
    width: 60%;
    height: 50%;
    color: #fff;
    outline: none;
    transition: box-shadow .3s ease-in-out;
    transition: background-color .3s ease-in-out;
    resize: both;
    overflow: auto;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .textarea:focus {
    box-shadow: 0 3px 10px rgba(0,0,0,.34);
  }

  ::-webkit-resizer {
    background: rgba(0,0,0,0.1);
    width: 30px;
    height: 30px;
  }

  .resize-box {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 30px;
    height: 30px;
    cursor: se-resize;
    background-color: rgba(0,0,0,0.1);
  }

  .menu {
    position: absolute;
    top: 50%;
    left: 4.7%;
    transform: translate(-4.7%, -50%);
    width: 10%;
    height: 300px;
    background-color: transparent;
    box-shadow: 0 3px 10px rgba(0,0,0,.34);
    border-radius: 5px;
    padding: 10px;
    padding-top: 0px;
    cursor: move;
    overflow-y: scroll;
    overflow-x: hidden;
    text-align: center;
  }

  .button-box {
    position: absolute;
    top: 3%;
    left: 50%;
    margin-right: -50%;
    margin-left: 5%;
    transform: translate(-50%, 0%);
  }

  .menu-icon {
    border: 0;
    background-color: transparent;
    color: #fff;
    border-radius: 5px;
    display: inline-block;
    width: 40%;
    height: 40px;
    box-shadow: 0 1px 6px rgba(0,0,0,.34);
    margin-top: 0;
    margin-right: 10px;
    margin-bottom: 20px;
    cursor: pointer;
  }

  .menu-icon:active {
    box-shadow: inset 0px -2px 7px rgba(0,0,0,.34);
  }

  .bold {
    border-left: 10px solid #ff3344;
  }

  .strikethrough {
    border-left: 10px solid #4bc0c0;
  }

  .link {
    border-left: 10px solid #ffce56;
  }

  .unlink {
    border-left: 10px solid #EA6351;
  }

  .italic {
    border-left: 10px solid #e7e9ed;
  }

  .underline {
    border-left: 10px solid #EBB293;
  }

  .order {
    border-left: 10px solid #95EA7F;
  }

  .color {
    border-left: 10px solid #ACB0F1;
  }

  .list {
    border-left: 10px solid #F4C5DA;
  }

  .image {
    border-left: 10px solid #FBE01E;
  }

  .font-name {
    border-left: 10px solid #E27833;
  }

  .font-size {
    border-left: 10px solid #36a2eb;
  }

  .center {
    border-left: 10px solid #4047FB;
  }

  .justify {
    border-left: 10px solid #DF37F4;
  }

  .left {
    border-left: 10px solid #3798A0;
  }

  .right {
    border-left: 10px solid #D4F6F5;
  }

  .undo {
    border-left: 10px solid #F55737;
  }

  .redo {
    border-left: 10px solid #EF9A30;
  }

  .link-txt {
    position: absolute;
    top: 15%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -15%);
    font-family: "Lato", sans-serif;
    font-size: 15px;
    color: #fff;
    text-align: center;
  }

  .linkHref {
    position: absolute;
    top: 35%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -35%);
    border: 0;
    border-bottom: 2px solid;
    background-color: transparent;
    font-family: "Lato", sans-serif;
    font-size: 15px;
    color: #fff;
    width: 70%;
    padding: 5px;
  }

  .submit-btn {
    position: absolute;
    top: 65%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -65%);
    border: 0;
    background-color: transparent;
    box-shadow: 0px -2px 7px rgba(0,0,0,.34);
    border-left: 10px solid #ff3344;
    width: 60%;
    border-radius: 5px;
    height: 40px;
    font-family: "Lato", sans-serif;
    color: #fff;
    cursor: pointer;
  }

  .submit-btn:active {
    box-shadow: inset 0px -2px 7px rgba(0,0,0,.34);
  }

  @media screen and (min-height: 1200px) and (min-width: 1000px) {
    .s-c {
      font-size: 1.5rem;
      padding: 1rem;
    }
  }

  @media screen and (max-width: 1200px) {
    .show-menu-btn {
      display: none;
    }
    .clip-buttons {
      position: absolute;
      top: 70%;
    }

    .count {
      display: none;
    }

    .textarea {
      position: absolute;
      top: 30%;
      left: 50%;
      transform: translate(-50%, -30%);
      height: 30%;
      width: 70%
    }

    .menu {
      display: none;
    }
  }

  @media screen and (max-width: 1000px) and (max-height: 600px) {
    .label {
      position: absolute;
      top: 15%;
      left: 50%;
      transform: translate(-50%, -10%);
    }

    .textarea {
      position: absolute;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      height: 30%;
      width: 70%
    }

    .clip-buttons {
      position: absolute;
      top: 75%;
    }
  }
</style>
