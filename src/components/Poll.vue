<template>
  <div class="poll-main">
    <div class="poll-answer" v-if="!visible">
      <h2 class="animated fadeInUp">{{label}}?</h2>
      <form action="" @submit.prevent="respond()">
        <input class="response-input" autofocus="" autocomplete="off" v-model="response" />
      </form>
    </div>
    <div class="results" v-if="visible">
      <div class="poll-graph">
        <ul class="graph">
          <h3>{{label}}?</h3>
          <li class="answer" v-if="results[0]">
            <div class="answer-container">
              <div class="percent">
                <p>{{percentOne + '%'}}</p>
              </div>
              <div class="response-container blue" :style="{width: (percentOne) + '%'}">
                <p class="response">{{results[0]}}</p>
              </div>
            </div>
          </li>
          <li class="answer" v-if="results[1]">
            <div class="answer-container">
              <div class="percent">
                <p>{{percentTwo + '%'}}</p>
              </div>
              <div class="response-container red" :style="{width: (percentTwo) + '%'}">
                <p class="response">{{results[1]}}</p>
              </div>
            </div>
          </li>
          <li class="answer" v-if="results[2]">
            <div class="answer-container">
              <div class="percent">
                <p>{{percentThree + '%'}}</p>
              </div>
              <div class="response-container yellow" :style="{width: (percentThree) + '%'}">
                <p class="response">{{results[2]}}</p>
              </div>
            </div>
          </li>
          <li class="answer" v-if="results[3]">
            <div class="answer-container">
              <div class="percent">
                <p>{{percentFour + '%'}}</p>
              </div>
              <div class="response-container green" :style="{width: (percentFour) + '%'}">
                <p class="response">{{results[3]}}</p>
              </div>
            </div>
          </li>
          <li class="answer" v-if="results[4]">
            <div class="answer-container">
              <div class="percent">
                <p>{{percentFive + '%'}}</p>
              </div>
              <div class="response-container purple" :style="{width: (percentFive) + '%'}">
                <p class="response">{{results[4]}}</p>
              </div>
            </div>
          </li>
        </ul>
        <div class="clip-btn-mobile" :class="{'clipped': clipped}">
          <button class="add-clip" @click="clip()">
            <i class="fa fa-plus"></i>
            <p>Add clip</p>
          </button>
        </div>
        <div class="stats">
          <div class="clip-btn" :class="{'clipped': clipped}">
            <button class="add-clip" @click="clip()">
              <i class="fa fa-plus"></i>
              <p>Add clip</p>
            </button>
          </div>
          <div class="stat talking">
            <p class="number">{{totalTalking}}</p>
            <p class="stat-text">Talking</p>
          </div>
          <div class="stat clips">
            <p class="number">{{totalClips}}</p>
            <p class="stat-text">Clips</p>
          </div>
          <div class="stat responses">
            <p class="number">{{totalAnswers}}</p>
            <p class="stat-text">Responses</p>
          </div>
        </div>
      </div>
      <div class="mobile-chat-button">
        <button @click.prevent="showChat()">
          <i class="fa fa-commenting"></i>
        </button>
      </div>
      <div class="chat-ui">
        <ul class="messages">
          <li class="message animated fadeInUp" v-for="message in messages" :class="{'me': message.name === name && message.chatid === chatid}">
            <div class="name">{{message.name | cap}}</div>
            <p :class="{'my-message': message.name === name}">
              {{message.message}}
            </p>
          </li>
        </ul>
        <form class="chat-box" @submit.prevent="send">
          <div class="input-box">
            <input class="chat-input" autocomplete="off" placeholder="Any thoughts?" v-model="message" />
          </div>
          <div class="input-btn">
            <button class="chat-btn">
              <i class="fa fa-send"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
  import io from 'socket.io-client'
  var socket = io()
  import Vue from 'vue'
  import Clips from '../../config/clips'
  import Responses from '../../config/responses'
  import ChatId from '../../config/chatid'
  import _ from 'lodash'
  import $ from 'jquery'
  import numeral from 'numeral'

  Vue.filter('first', function (value) {
    return value.charAt(0)
  })

  Vue.filter('space', function (value) {
    return value.replace(/\-/g, ' ') // eslint-disable-line no-useless-escape
  })

  Vue.filter('cut', function (value) {
    return value.slice(1, value.length)
  })

  Vue.filter('cap', function (value) {
    return _.upperFirst(value)
  })
  export default {
    data () {
      return {
        path: this.$route.path.slice(1, this.$route.path.length),
        visible: false,
        response: '',
        question: [],
        label: _.capitalize(this.$route.path.replace(/-/g, ' ').slice(1, this.$route.path.length)),
        clipped: false,
        clipHelp: 'Click to clip this question.',
        message: '',
        name: this.$parent.username,
        chatid: '',
        messages: [],
        width: $(window).width(),
        results: [],
        votes: []
      }
    },
    computed: {
      numUsers: function () {
        if (this.question !== null) {
          return this.question.numUsers
        } else {
          return 0
        }
      },
      clips: function () {
        if (this.question !== null) {
          return this.question.clips
        } else {
          return 0
        }
      },
      totalResponses: function () {
        if (this.question !== null) {
          return this.question.totalResponses
        } else {
          return 0
        }
      },
      percentOne: function () {
        return Math.floor((this.votes[0] / this.question.totalResponses) * 100)
      },
      percentTwo: function () {
        return Math.floor((this.votes[1] / this.question.totalResponses) * 100)
      },
      percentThree: function () {
        return Math.floor((this.votes[2] / this.question.totalResponses) * 100)
      },
      percentFour: function () {
        return Math.floor((this.votes[3] / this.question.totalResponses) * 100)
      },
      percentFive: function () {
        return Math.floor((this.votes[4] / this.question.totalResponses) * 100)
      },
      totalAnswers: function () {
        var total = this.question.totalResponses
        if (total < 1100) {
          return numeral(total).format('0a')
        } else {
          return numeral(total).format('0.0a')
        }
      },
      totalClips: function () {
        var total = this.question.clips
        if (total < 1100) {
          return numeral(total).format('0a')
        } else {
          return numeral(total).format('0.0a')
        }
      },
      totalTalking: function () {
        var total = this.question.numUsers
        if (total < 1100) {
          return numeral(total).format('0a')
        } else {
          return numeral(total).format('0.0a')
        }
      }
    },
    watch: {
      messages: function () {
        /* Scroll to bottom on new message
        setTimeout(function () {
          $('.messages').scrollTop(999999999)
        }, 100)
        */
      },
      width: function () {
        this.width = $(window).width()
        if (this.width >= 1100) {
          $('.chat-ui').show()
          $('.poll-graph').show()
        } else {
          $('.chat-ui').hide()
          $('.poll-graph').show()
        }
      }
    },
    methods: {
      loadData () {
        this.$http.post('/loadQuestion', JSON.stringify({question: this.path})).then(function (res) {
          this.question = res.data.data
        })
      },
      loadGraph: function () {
        this.$http.post('/loadQuestion', JSON.stringify({question: this.path})).then(function (res) {
          this.question = res.data.data

          let topAnswers = _.toPairs(_.countBy(this.question.responses))
          let sorted = topAnswers.sort(function (a, b) {
            return b[1] - a[1]
          })
          let five = _.fromPairs(sorted.slice(0, 5))
          this.results = _.keys(five)
          this.votes = _.values(five)
        })
      },
      respond () {
        let params = {
          question: this.path,
          response: _.capitalize(this.response)
        }

        socket.emit('response', params)

        Responses.respond(this.$route.path)

        this.response = ''
      },
      clip () {
        if (this.clipped === true) {
          return
        } else {
          socket.emit('clip', this.path)

          Clips.addClip(this.$route.path)

          this.clipped = true
          this.$parent.loadclip()
        }
      },
      send () {
        var data = {
          name: this.$parent.username,
          chatid: this.chatid,
          message: this.message.trim(),
          question: this.path
        }

        socket.emit('send message', data)

        this.message = ''
      },
      showChat () {
        if ($('.chat-ui').css('display') === 'none') {
          $('.chat-ui').show('slow')
          $('.poll-graph').hide('slow')
        } else {
          $('.chat-ui').hide('slow')
          $('.poll-graph').show('slow')
        }
      }
    },
    mounted: function () {
      var that = this

      ChatId.chatId()

      this.chatid = JSON.parse(window.localStorage.getItem('chatid'))

      $(window).resize(function () {
        that.width = $(window).width()
      })

      $('.response-input').focus()

      if (Responses.checkResponse(that.$route.path)) {
        socket.emit('check returning', this.path)
      } else {
        that.visible = false
      }

      if (window.localStorage.getItem('clips') !== null) {
        if (JSON.parse(window.localStorage.getItem('clips')).indexOf(this.$route.path) !== -1) {
          this.clipped = true
        }
      }

      if (!window.navigator.onLine) {
        this.loadGraph()
        this.visible = true
      }

      socket.on('update', function () {
        that.loadGraph()
        that.visible = true
      })

      socket.on('reload data', function () {
        that.loadGraph()
        that.visible = true
      })

      socket.on('message', function (data) {
        that.messages.push(data)
      })
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

  .poll-answer {
    position: absolute;
    top: 40%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -40%);
    text-align: center;
    width: 80%;
  }

  .poll-answer h2 {
    font-family: 'Lato', sans-serif;
    font-size: 80px;
    font-weight: 400;
    text-rendering: optimizeLegibility;
    color: #fff;
    word-wrap: break-word;
    animation-duration: 1s;
    -webkit-animation-duration: 1s;
  }

  .poll-answer input {
    background-color: rgba(0,0,0,.2);
    box-shadow: 0 0 .2rem rgba(0,0,0,.5);
    border: 0;
    border-radius: 5px;
    color: #fff;
    font-family: 'Lato', sans-serif;
    font-size: 48px;
    padding: 10px;
    width: 30%;
    transition: all 1s ease-in-out;
    -webkit-transition: all 1s ease-in-out;
  }

  .poll-answer input:focus {
    width: 65%;
  }

  .results {
    position: absolute;
    top: 52%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -52%);
    width: 100%;
    height: 78%;
  }

  .poll-graph {
    position: absolute;
    top: 50%;
    left: 10%;
    transform: translate(-10%, -50%);
    height: 90%;
    width: 40%;
    border-radius: 5px;
    margin: 0;
    color: #fff;
    font-family: 'Lato', sans-serif;
    font-size: .875rem;
  }

  .poll-graph ul {
    padding: 0;
    margin: 0;
    list-style: none;
    width: 100%;
    height: 80%;
    box-sizing: border-box;
    padding-bottom: 1rem;
    overflow-y: scroll;
  }

  .poll-graph h3 {
    font-weight: normal;
    font-size: 2rem;
    margin-top: 0;
  }

  .poll-graph li {
  }

  .poll-graph .answer-container {
    box-sizing: border-box;
    width: 80%;
    white-space: nowrap;
  }

  .poll-graph .percent {
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    width: 10%;
    margin-right: .5rem;
  }

  .poll-graph .response-container {
    display: inline-block;
    height: 1.5rem;
    border-radius: 5px;
    background-color: rgba(54, 162, 235, 1);
    padding-left: 1rem;
    transition: all .5s ease-in-out;
    max-width: 80%;
  }

  .poll-graph .blue {
    background-color: #36A2EB;
  }

  .poll-graph .red {
    background-color: rgba(255, 99, 132, 1);
  }

  .poll-graph .yellow {
    background-color: rgba(255, 206, 86, 1);
  }

  .poll-graph .green {
    background-color: rgba(75, 192, 192, 1);
  }

  .poll-graph .purple {
    background-color: rgba(153, 102, 255, 1);
  }

  .poll-graph .thirty {
    width: 30%;
  }

  .poll-graph .ten {
    width: 10%;
  }

  .poll-graph .fourty {
    width: 40%;
  }

  .poll-graph .five {
    width: 5%;
  }

  .response-container p {
    margin: 0;
    display: inline-block;
    vertical-align: middle;
  }

  .stats {
    width: 100%;
    height: 20%;
    border-radius: 5px;
    margin: 0;
    color: #fff;
    font-family: 'Lato', sans-serif;
    box-sizing: border-box;
    display: table;
  }

  .stats .stat {
    display: table-cell;
    vertical-align: bottom;
    height: 100%;
    box-sizing: border-box;
    text-align: left;
    width: 25%;
  }

  .stats .number {
    font-size: 3rem;
    margin: 0;
    text-align: center;
  }

  .stats .stat-text {
    margin: 0;
    text-align: center;
  }

  .total_active {
    display: none;
    position: absolute;
    top: 15%;
    left: 60%;
    width: 30%;
    text-align: center;
  }

  .total_active .talking {
    font-family: 'Lato', sans-serif;
    color: #F55737;
    font-size: 18px;
    border: 2px solid;
    padding: 5px;
    min-width: 10%;
    border-radius: 5px;
    display: inline-block;
    margin: 0;
    margin-right: 20px;
  }

  .total_active .clips {
    font-family: 'Lato', sans-serif;
    font-size: 18px;
    color: #36a2eb;
    border: 2px solid;
    border-radius: 50px;
    padding: 5px;
    min-width: 10%;
    margin: 0;
    margin-right: 20px;
    display: inline-block;
  }

  .total_active .answers {
    font-family: 'Lato', sans-serif;
    font-size: 18px;
    color: #EF9A30;
    display: inline-block;
    border-bottom: 2px solid;
  }

  .clip-btn {
    display: table-cell;
    vertical-align: bottom;
    box-sizing: border-box;
    width: 25%;
    height: 100%;
  }

  .clip-btn button {
    margin: 0;
    padding: 0;
    color: #fff;
    border: 0;
    background-color: rgba(0,171,108, .7);
    border-radius: 5px;
    width: 100%;
    height: 85%;
    cursor: pointer;
    font-size: 18px;
  }

  .clip-btn p {
    margin: 0;
  }

  .clip-btn-mobile {
    display: none;
  }

  .clipped {
    opacity: .5;
  }

  .mobile-chat-button {
    display: none;
    position: absolute;
    top: 40%;
    left: 100%;
    transform: translate(-100%, -40%);
    box-sizing: border-box;
  }

  .mobile-chat-button button {
    border: 0;
    border-radius: 5px;
    width: 3rem;
    height: 3rem;
    background-color: transparent;
    color: #fff;
    font-size: 1.25rem;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.35);
    cursor: pointer;
  }

  .chat-ui {
    position: absolute;
    top: 50%;
    left: 90%;
    transform: translate(-90%, -50%);
    width: 32%;
    height: 90%;
    background-color: transparent;
    border-radius: 5px;
  }

  .results .messages {
    width: 100%;
    height: 90%;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    list-style: none;
    padding-left: 10px;
    padding-right: 10px;
    overflow-y: scroll;
  }

  .messages .name {
    font-family: 'Lato', sans-serif;
    color: #fff;
    font-size: 15px;
    font-weight: bold;
  }

  .messages p {
    font-family: 'Lato', sans-serif;
    background-color: transparent;
    color: #fff;
    list-style-type: none;
    border-radius: 5px !important;
    max-width: 60%;
    margin-bottom: 2rem;
    display: inline-block;
    text-align: justify;
  }

  .me {
    text-align: right;
    margin-right: 10px;
  }

  .my-message {
    opacity: .6;
  }

  .chat-box {
    background-color: transparent;
    border-radius: 5px;
    width: 100%;
    height: 10%;
    text-align: center;
    box-sizing: border-box;
    display: table;
    transition: all .5s ease-in-out;
    box-shadow: 0px -1px 5px rgba(0,0,0,.34);
  }

  .chat-box:hover {
  }

  .input-box {
    display: table-cell;
    vertical-align: middle;
    width: 80%;
    text-align: left;
    padding-left: 20px;
  }

  .input-btn {
    display: table-cell;
    vertical-align: middle;
    width: 15%;
    text-align: center;
    border-left: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: -1px 0 3px rgba(0, 0, 0, 0.14);
    cursor: pointer;
  }

  .chat-box input {
    vertical-align: middle;
    width: 90%;
    border: 0;
    background-color: transparent;
    box-shadow: 0;
    color: #fff;
    font-family: 'Lato', sans-serif;
    font-size: 15px;
    padding: .5rem;
}

  .chat-box input::-webkit-input-placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  .chat-box input::-moz-placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  .chat-box input:-ms-input-placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  .chat-box input:-moz-placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  .chat-btn {
    color: white;
    border: 0;
    background-color: transparent;
    font-size: 15px;
    cursor: pointer;
  }

  .chat-btn i {
  }

  .plus-btn {
    position: absolute;
    top: 31%;
    left: 76%;
  }

  .check-btn {
    opacity: 0;
  }

  @-webkit-keyframes btn-1 {
    0% {
      left: 15%;
    }
    100% {
      left: -55%;
    }
  }

  @keyframes btn-1 {
    0% {
      left: 15%;
    }
    100% {
      left: -55%;
    }
  }

  @-webkit-keyframes btn-2 {
    0% {
      left: 76%;
    }
    100% {
      left: 42%;
      font-size: 18px;
      top: 20%;
    }
  }

  @keyframes btn-2 {
    0% {
      left: 76%;
    }
    100% {
      left: 42%;
      font-size: 18px;
      top: 20%;
    }
  }

  .chat-box:hover .btn-text {
    -webkit-animation: btn-1 .2s forwards;
  	animation: btn-1 .2s forwards;
  }

  .chat-box:hover .plus-btn {
    -webkit-animation: btn-2 .2s forwards;
  	animation: btn-2 .2s forwards;
  }

  .visible {
    opacity: 0;
  }

  @media screen and (max-width: 1100px) {
    .poll-graph,
    .chat-ui {
      position: absolute;
      top: 0%;
      left: 50%;
      transform: translate(-50%, 0%);
      width: 80%;
    }

    .mobile-chat-button {
      display: block;
    }

    .clip-btn button {
      height: 65%;
    }

    .chat-ui {
      display: none;
    }
  }

  @media screen and (max-width: 1000px) {
    .poll-answer h2 {
      font-size: 3rem;
    }
  }

  @media screen and (max-height: 1000px) {

    .clip-btn button {
      height: 75%;
    }
  }

  @media screen and (max-width: 700px) {
    .poll-graph h3 {
      font-size: 1.25rem;
    }

    .poll-graph .response-container {
      max-width: 70%;
      height: 1.5rem;
    }

    .poll-graph .percent {
      margin-right: 1rem;
    }

    .stats {
      height: 15%;
    }

    .stats .number {
      font-size: 2rem;
    }

    .clip-btn {
      display: none;
    }

    .clip-btn-mobile {
      display: block;
    }

    .clip-btn-mobile button {
      margin: 0;
      padding: 0;
      color: #fff;
      border: 0;
      background-color: rgba(0,171,108, .7);
      border-radius: 5px;
      width: 100%;
      height: 3.5rem;
      cursor: pointer;
      font-size: 1rem;
    }

    .clip-btn-mobile i {
      margin-right: .5rem;
    }

    .clip-btn-mobile p {
      display: inline-block;
      margin: 0;
    }
  }

  @media screen and (max-width: 500px) {
    .poll-answer h2 {
      margin-bottom: 3rem;
      font-size: 2rem;
    }

    .poll-answer input {
      background: rgba(0, 0, 0, 0.2);
      border-bottom: 0;
      border-radius: 5px;
      font-size: 1.5rem;
    }

    .chat-box {
      background-color: rgba(0,0,0,.2);
      box-shadow: none;
    }

    .input-btn {
      width: 20%;
    }

    .me {
      text-align: right !important;
    }
  }

  @media screen and (max-width: 400px) {
    .poll-answer input {
      font-size: 1.25rem;
    }

    .poll-graph h3 {
      font-size: 1.25rem;
    }

    .poll-graph .response-container {
      height: 1.5rem;
    }

    .poll-graph .response-container p {
      font-size: .825rem;
    }

    .poll-graph .percent p {
      font-size: .825rem;
    }

    .stats .number {
      font-size: 1.5rem;
    }

    .stats .stat-text {
      font-size: .825rem;
    }

    .clip-btn-mobile button {
      height: 2.5rem;
      font-size: .825rem;
    }
  }

  @media screen and (max-width: 350px) {
    .poll-answer input {
      font-size: 1rem;
    }

    .poll-graph h3 {
      font-size: 1rem;
    }

    .mobile-chat-button button {
      font-size: 1rem;
      width: 2.5rem;
      height: 2.5rem;
    }

    .messages .name {
      font-size: .825rem;
    }

    .messages li p {
      font-size: .825rem;
    }
  }
</style>
