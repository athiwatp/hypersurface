<template>
  <div class="main" v-show="!hideNav">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <nav class="navigation" v-show="loggedIn">
      <div class="main-link">
        <router-link to="/feed" class="vlink">
          <h1 class="logo">hypersurface</h1>
        </router-link>
        <router-link to="/feed" class="vlink">
          <h1 class="logo-small">H</h1>
        </router-link>
      </div>
      <div class="nav-buttons">
        <input
          class="search-bar"
          placeholder="search"
          v-model="search"
          @focus="searching = true"
          @blur="searching = false"
        >
        </input>
        <i class="search-button fa fa-search" @click="mobileSearch()"></i>
        <p class="new-question" @click="addQuestion()">
          <i class="fa fa-plus-circle" aria-hidden="true"></i>
          <span>Add a question</span>
        </p>
        <p class="greeting" @click="showClips()">
          <span v-if="username !== ''">{{username[0] | cap}}</span>
        </p>
      </div>
      <div class="mobile-search">
        <input
          class="search-bar-small"
          placeholder="search"
          v-model="search"
          @focus="searching = true"
          @blur="searching = false"
        />
        <i class="fa fa-close" @click="mobileSearch()"></i>
      </div>
    </nav>
    <footer class="footer" v-show="loggedIn">
      <div class="location">
        <p class="you-are-here">{{$route.path | space | cut | cap}}</p>
      </div>
        <div class="information">
          <router-link to="/info" class="vlink">
            <i class="fa fa-cog" aria-hidden="true"></i>
          </router-link>
        </div>
    </footer>
    <transition-group
      name="fade"
      mode="out-in"
    >
      <ul class="clip-menu" v-show="showC" key="clip">
        <h2 class="clip-txt">{{username}}'s clips</h2>
        <div class="list-box">
          <li class="clip-item" v-for="c in clips">
            <p class="iClip" @click="goToClip(c)">{{c | space | cut | cap}}?</p>
          </li>
        </div>
        <div class="close-clips" @click="showClips()">
            <i class="fa fa-close"></i>
        </div>
      </ul>
      <new-question
        :current-name="username"
        v-on:close="closeAdd"
        v-on:help="help"
        v-show="add"
        key="add"
      >
      </new-question>
      <search-results
        v-show="searching && $route.path !== '/feed'"
        key="search"
        :current-search="search"
      >
      </search-results>
    </transition-group>
    <transition enter-active-class="animated slideInDown" leave-active-class="animated slideOutUp">
      <div class="help-bar" v-show="showHelp" :class="{ 'error': error }">
        <div class="help-message">
          <span>{{helpMessage}}</span>
          <i class="added fa fa-check" v-if="success"></i>
        </div>
        <div class="help-icons">
          <button
            class="invalid-list"
            v-if="error && helpMessage === 'The Title and Category fields are required. Some special characters are invalid in the Title field.'"
            @click="unusable()"
          >
            List of invalid characters
          </button>
        </div>
        <i class="close-help fa fa-close" @click="closeHelp"></i>
      </div>
    </transition>
    <div class="landscape-warning">
      <span>Hypersurface is best viewed in portrait mode. Please rotate your device.</span>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import _ from 'lodash'
  import Add from 'components/Add'
  import Search from 'components/Search'
  import Velocity from 'velocity-animate'
  import $ from 'jquery'

  Vue.filter('space', function (value) {
    return value.replace(/\-/g, ' ') // eslint-disable-line no-useless-escape
  })

  Vue.filter('cut', function (value) {
    return value.slice(1, value.length)
  })

  Vue.filter('cap', function (value) {
    return _.capitalize(value)
  })

  export default {
    data: function () {
      return {
        loggedIn: false,
        username: '',
        search: '',
        searching: false,
        user: false,
        showC: false,
        currentClip: null,
        currentCategory: '',
        clips: null,
        add: false,
        showHelp: false,
        helpMessage: 'Someone has already added that question.',
        error: false,
        success: false,
        width: $(window).width(),
        hideNav: false
      }
    },
    computed: {
      showSearch: function () {
        if (this.$route.path === '/feed') {
          return false
        } else {
          return true
        }
      }
    },
    watch: {
      width: function () {
        this.width = $(window).width()
        if (this.width > 500) {
          $('.main-link').show()
          $('.nav-buttons').show()
          $('.mobile-search').hide()
        }
      }
    },
    components: {
      'new-question': Add,
      'search-results': Search
    },
    methods: {
      login () {
        this.username = JSON.parse(window.localStorage.getItem('user'))
        this.loggedIn = true
      },
      mobileSearch () {
        if ($('.mobile-search').css('display') === 'none') {
          $('.main-link').hide('fast')
          $('.nav-buttons').hide('fast', function () {
            $('.mobile-search').show('slow')
          })
        } else {
          $('.mobile-search').hide('fast', function () {
            $('.main-link').show('slow')
            $('.nav-buttons').show('slow')
          })
        }
      },
      showClips () {
        if (this.showC === false) {
          this.showC = true
        } else {
          this.showC = false
        }
      },
      goToClip (clip) {
        this.currentClip = clip
        this.$router.push('/clip')
        this.showClips()
      },
      loadclip () {
        if (window.localStorage.getItem('clips') !== null) {
          this.clips = JSON.parse(window.localStorage.getItem('clips'))
        } else {
          this.clips = []
        }
      },
      addQuestion: function () {
        this.add = true
        this.$emit('name', this.username)
      },
      closeAdd: function () {
        this.add = false
      },
      help: function (data) {
        this.error = false
        this.success = false

        if (data === 'Title') {
          this.helpMessage = 'Add a new question here!'
          this.showHelp = true
        }
        if (data === 'Category') {
          this.helpMessage = 'Enter a category that best identifies your question.'
          this.showHelp = true
        }
        if (data === 'Description') {
          this.helpMessage = 'Enter any extra details here.'
          this.showHelp = true
        }
        if (data === 'Embed') {
          this.helpMessage = 'Add any embedable media here. Try: https://player.vimeo.com/video/112129153'
          this.showHelp = true
        }
        if (data === 'Photo') {
          this.helpMessage = 'Copy the url of a photo and place it here.'
          this.showHelp = true
        }
        if (data === 'Link') {
          this.helpMessage = 'Enter a url and link name to create a external link.'
          this.showHelp = true
        }
        if (data === 'Field error') {
          this.helpMessage = 'The Title and Category fields are required. Some special characters are invalid in the Title field.'
          this.error = true
          this.showHelp = true
        }
        if (data === 'duplicate') {
          this.helpMessage = 'Someone has already added that question.'
          this.error = true
          this.showHelp = true
        }
        if (data === 'success') {
          this.helpMessage = ''
          this.success = true
          this.showHelp = true
          this.autoHide()
        }
        if (data === 'saved note') {
          this.helpMessage = 'Saved note!'
          this.showHelp = true
          this.autoHide()
        }
        if (data === 'invalid name') {
          this.helpMessage = 'Please keep your name uner 12 characters'
          this.error = true
          this.showHelp = true
        }
        if (data === 'No storage') {
          this.helpMessage = 'Please disable Private Browsing to continue.'
          this.error = true
          this.showHelp = true
        }
      },
      closeHelp: function () {
        this.showHelp = false
      },
      autoHide: function () {
        var that = this
        setTimeout(function () {
          that.showHelp = false
        }, 2000)
      },
      unusable () {
        this.helpMessage = '"" . ^ [ ] ` { } | ! * ; / ? ( )'
      },
      beforeEnter: function (el) {
        el.style.width = '10%'
        el.style.opacity = 0
      },
      enter: function (el, done) {
        var delay = el.dataset.index * 150
        setTimeout(function () {
          Velocity(el, {width: '21%', opacity: 1}, { complete: done })
        }, delay)
      },
      leave: function (el, done) {
        var delay = el.dataset.index * 150
        setTimeout(function () {
          Velocity(el, {width: '10%', opacity: 0}, { complete: done })
        }, delay)
      }
    },
    mounted: function () {
      var that = this

      if (!window.navigator.onLine) {
        this.showHelp = true
        this.error = true
        this.helpMessage = 'Offline mode enabled.'
      }

      $(window).resize(function () {
        that.width = $(window).width()
      })

      if (window.localStorage.getItem('loggedIn')) {
        this.loggedIn = true
      }

      if (window.localStorage.getItem('user')) {
        this.username = JSON.parse(window.localStorage.getItem('user'))
      }
      this.loadclip()
    }
  }
</script>
<style>
  @import 'https://fonts.googleapis.com/css?family=Lato:400,700';

  html {
    background: rgb(63, 105, 181);
  }

  body {
    margin: 0 !important;
  }

  button {
    outline: none;
    cursor: pointer;
  }

  .main {
    position: absolute;
    top: 0;
    left: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    background: rgb(63, 105, 181);
  }

  @-webkit-keyframes bg-anim {
    0%{background-position:0% 50%}
    50%{background-position:100% 50%}
    100%{background-position:0% 50%}
  }
  @-moz-keyframes bg-anim {
    0%{background-position:0% 50%}
    50%{background-position:100% 50%}
    100%{background-position:0% 50%}
  }
  @keyframes bg-anim {
    0%{background-position:0% 50%}
    50%{background-position:100% 50%}
    100%{background-position:0% 50%}
  }

  .vlink, .vlink:visited {
    color: #fff;
    text-decoration: none;
  }

  ::-webkit-scrollbar {
    width: 4px;
    height: 2px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    -webkit-border-radius: 5px;
    border-radius: 5px;
  }

  .main .navigation {
    display: table;
    box-sizing: border-box;
    width: 100%;
    padding: .5rem;
    padding-left: 3rem;
    padding-right: 3rem;
  }

  .main .main-link {
    display: table-cell;
    vertical-align: middle;
    width: 25%;
  }

  .main .logo {
    font-family: 'Lato', sans-serif;
    font-size: 15px;
    font-weight: normal;
    color: #fff;
    cursor: pointer;
    margin: 0;
  }

  .logo-small {
    display: none;
    font-family: 'Lato', sans-serif;
    font-size: 1rem;
    font-weight: bold;
    color: #fff;
    cursor: pointer;
    margin: 0;
    border: 2px solid;
    border-radius: 5px;
    padding: .5rem;
    padding-top: .25rem;
    padding-bottom: .25rem;
  }

  .main .nav-buttons {
    display: table-cell;
    vertical-align: middle;
    text-align: right;
  }

  .main .search-bar {
    border: 0;
    font-family: 'Lato', sans-serif;
    font-size: 15px;
    font-weight: normal;
    color: #fff;
    padding: .5rem;
    width: 50%;
    border-radius: 5px;
    margin-right: 2rem;
    background-color: rgba(0, 0, 0, 0.2);
    transition: all .5s ease-in-out;
  }

  .main .search-bar:focus {
    background-color: #fff;
    color: #0a0a0a;
    box-shadow: 0px 3px 3px rgba(0,0,0,.14);
  }

  .main .search-bar::-webkit-input-placeholder,
  .search-bar-small::-webkit-input-placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  .main .search-bar::-moz-placeholder,
  .search-bar-small::-moz-placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  .main .search-bar:-ms-input-placeholder,
  .search-bar-small:-ms-input-placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  .main .search-bar:-moz-placeholder,
  .search-bar-small:-moz-placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  .search-button {
    display: none;
    color: #fff;
    font-size: 1.25rem;
    margin-right: 1.5rem;
    cursor: pointer;
  }

  .main .new-question {
    cursor: pointer;
    font-family: 'Lato', sans-serif;
    font-size: 15px;
    font-weight: normal;
    color: #fff;
    margin-right: 2rem;
    padding: .5rem;
    border-radius: 5px;
    background-color: rgba(0,171,108, .75);
    display: inline-block;
  }

  .main .new-question i {
    margin-right: .5rem;
  }

  .main .greeting {
    font-family: 'Lato', sans-serif;
    font-size: 15px;
    font-weight: normal;
    color: #fff;
    display: inline-block;
    width: 20px;
    height: 20px;
    padding: .5rem;
    border-radius: 50%;
    background-color: #F55737;
    text-align: center;
    box-shadow: 0px 1px 3px rgba(0,0,0,.24);
    cursor: pointer;
  }

  ::-webkit-input-placeholder {
  color: #fff;
  }
  ::-moz-placeholder {
    color: #fff;
  }
  :-ms-input-placeholder {
    color: #fff;
  }
  :-moz-placeholder {
    color: #fff;
  }

  .main input:focus {
    outline: none;
  }

  .main .greeting:hover {
    animation: bounce .5s infinite;
    -webkit-animation: bounce .5s infinite;
  }

  @keyframes bounce {
    0% {
      transform: translate(0,0);
    }
    50% {
      transform: translate(0, -40%);
    }
    100% {
      transform: translate(0,0);
    }
  }

  @-webkit-keyframes bounce {
    0% {
      transform: translate(0,0);
    }
    50% {
      transform: translate(0, -40%);
    }
    100% {
      transform: translate(0,0);
    }
  }

  .mobile-search {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    display: none;
  }

  .search-bar-small {
    border: 0;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    padding: .5rem;
    font-family: 'Lato', sans-serif;
    font-size: 15px;
    font-weight: normal;
    color: #fff;
    width: 75%;
    margin-right: 1rem;
  }

  .mobile-search i {
    color: #fff;
    font-size: 1.25rem;
    cursor: pointer;
  }

  .list-box {
    padding: 2px;
    height: 75%;
    overflow-y: scroll;
    margin-bottom: .5rem;
  }

  .clip-menu {
    position: absolute;
    top: 0%;
    left: 100%;
    margin: 0;
    margin-right: -50%;
    transform: translate(-100%, 0%);
    width: 21%;
    height: 100%;
    box-sizing: border-box;
    list-style: none;
    box-shadow: 0 3px 10px rgba(0,0,0,.34);
    border-radius: 5px;
    text-align: center;
    padding: 10px;
    padding-left: 13px;
    background: rgb(63, 105, 181);
  }

  .clip-menu::-webkit-scrollbar-thumb {
    background: transparent;
  }

  .clip-menu h2 {
    color: #fff;
    font-family: 'Lato', sans-serif;
    font-size: 18px;
    font-weight: normal;
    padding-left: 15px;
    background-color: rgba(0,171,108, .7);
    padding: 10px;
    border-radius: 5px;
    margin-top: .5rem;
  }

  .clip-item {
    font-family: 'Lato', sans-serif;
    font-size: 15px;
    color: #fff;
    padding: 0;
    margin: 0;
    margin-bottom: 5px;
  }

  .clip-item p {
    padding: 10px;
    margin: 0;
    cursor: pointer;
    border-radius: 5px;
  }

  .close-clips {
    display: inline-block;
    color: #fff;
    width: 20px;
    height: 20px;
    padding: .5rem;
    border-radius: 50%;
    background-color: #F55737;
    cursor: pointer;
  }

  .close-clips i {
    padding-top: .08rem;
  }

  .main .app-section {
    padding-right: 2rem;
    padding-left: 2rem;
  }

  .main footer {
    position: absolute;
    bottom: 4%;
    display: table;
    box-sizing: border-box;
    width: 100%;
    padding: .5rem;
    padding-left: 3rem;
    padding-right: 3rem;
  }

  .main .location {
    overflow-x: hidden;
    display: table-cell;
    vertical-align: middle;
    font-family: 'Lato', sans-serif;
    font-size: 15px;
    color: #fff;
    transition: all 1s ease-in-out;
    -webkit-transition: all 1s ease-in-out;
    padding-right: 2rem;
    box-sizing: border-box;
  }

  .main .location p {
    margin: 0;
    display: inline-block;
    border-bottom: 2px solid #fff;
  }

  .main .information {
    display: table-cell;
    text-align: right;
    width: 1%;
    vertical-align: middle;
    color: #fff;
    font-size: 20px;
    cursor: pointer;
  }

  .main .information:hover {
    animation: rotate 2s infinite;
    -webkit-animation: rotate 2s infinite;
  }

  @keyframes rotate {
    0% {
      -ms-transform: rotate(0deg); /* IE 9 */
      -webkit-transform: rotate(0deg); /* Safari */
      transform: rotate(0deg); /* Standard syntax */
    }
    50% {
      -ms-transform: rotate(180deg); /* IE 9 */
      -webkit-transform: rotate(180deg); /* Safari */
      transform: rotate(180deg); /* Standard syntax */
    }
    100% {
      -ms-transform: rotate(0deg); /* IE 9 */
      -webkit-transform: rotate(0deg); /* Safari */
      transform: rotate(0deg); /* Standard syntax */
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }

  .fade-enter, .fade-leave-active {
    opacity: 0
  }

  .help-bar {
    display: table;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6.5%;
    padding-left: 2rem;
    padding-right: 2rem;
    text-align: center;
    background-color: rgb(0,171,108);
    color: #fff;
    font-size: 1rem;
    font-family: 'Lato', sans-serif;
    border-bottom: 1px solid rgba(0,0,0,0.15);
    box-shadow: 0 3px 3px rgba(0,0,0,.1);
    box-sizing: border-box;
  }

  .help-bar .help-message {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
  }

  .help-bar .help-icons {
    display: table-cell;
    vertical-align: middle;
    text-align: right;
  }

  .help-bar button {
    color: #fff;
    border: 0;
    border-radius: 5px;
    background-color: transparent;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
    padding: .5rem;
    margin-right: 2rem;
    cursor: pointer;
  }

  .help-bar .added {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .help-bar .close-help {
    position: absolute;
    left: 97%;
    top: 50%;
    transform: translate(-97%, -50%);
    cursor: pointer;
  }

  .help-bar button:active {
    box-shadow: inset 0 1px 3px rgba(0,0,0,.24);
  }

  .error {
    background-color: #F55737;
  }

  .landscape-warning {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background-color: rgb(63, 105, 181);
  }

  .landscape-warning span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    box-sizing: border-box;
    text-align: center;
    font-family: 'Lato', sans-serif;
    font-size: .825rem;
    color: #fff;
  }


  @media screen and (max-width: 1250px) {
    .clip-menu {
      width: 30%;
    }
  }

  @media screen and (min-height: 1000px) {
    .list-box {
      height: 80%;
    }
  }

  @media screen and (max-width: 1000px) {
    .help-bar .invalid-list {
      display: none !important;
    }
  }

  @media screen and (max-width: 800px) {
    .search-bar {
      margin-right: 1.5rem !important;
    }

    .logo {
      display: none;
    }

    .logo-small {
      display: inline-block;
    }

    .new-question {
      margin-right: 1.5rem !important;
    }

    .new-question span {
      display: none;
    }

    .new-question i {
      font-size: 1.25rem;
      padding-left: .25rem;
      padding-right: .25rem;
      margin: 0 !important;
    }

    .clip-menu {
      width: 40%;
    }

    .help-bar span {
      font-size: .825rem;
    }
  }

  @media screen and (min-width: 700px) and (max-height: 600px) {
    .help-bar {
      display: none !important;
    }
  }

  @media screen and (max-width: 500px) {
    .main .navigation {
      padding: 1rem;
      padding-left: 2rem;
      padding-right: 2rem;

    }

    .search-bar{
      display: none;
    }

    .search-button {
      display: inline-block;
      font-size: 1rem;
      margin-right: 1rem !important;
    }

    .clip-menu {
      width: 65%;
    }

    .main .greeting {
      width: 17px;
      height: 17px;
      font-size: .825rem;
      margin-top: 0.15rem;
      margin-bottom: 0;
    }

    .main .greeting:hover {
      animation: none !important;
      -webkit-animation: none !important;
    }

    .main .new-question {
      padding: .45rem;
      margin-top: 0.15rem;
      margin-bottom: 0;
      margin-right: 1rem !important;
    }

    .main .new-question i {
      font-size: 1rem;
    }

    .main footer {
      padding-left: 2rem;
      padding-right: 2rem;
    }

    .help-bar {
      padding-top: .5rem;
      padding-bottom: .5rem;
    }

    .help-bar .help-message {
      width: 90%;
    }

    .help-bar .help-message span{
      font-size: .825rem;
    }

    .help-bar .invalid-list {
      display: none !important;
    }
  }

  @media screen and (orientation: landscape) and (max-height: 500px) {
    .landscape-warning {
      display: block;
    }
  }

  @media screen and (max-width: 350px) {
    .main .location {
      font-size: .825rem;
    }
  }
</style>
