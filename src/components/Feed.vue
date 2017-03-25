<template>
  <div class="feed">
    <transition-group
      name="staggered-fade"
      tag="ul"
      v-bind:css="false"
      v-on:before-enter="beforeEnter"
      v-on:enter="enter"
      v-on:leave="leave"
    >
      <li
        class="question"
        v-for="(q, index) in orderedList"
        :key="q"
        v-bind:data-index="index"
        :style="{height: itemHeight}"
      >
        <router-link :to="{name: 'question', params: {question: q.question}}">
          <p class="title">
            <span>{{q.question | space | cap}}?</span>
          </p>
        </router-link>
        <div class="stats">
          <p class="talking">{{q.numUsers}}</p>
          <span class="clips">{{q.clips}}</span>
          <div class="answers">{{q.totalResponses}}</div>
        </div>
        <p class="description" v-if="q.description !== ''">{{q.description}}</p>
        <div class="media" v-if="!offline">
          <iframe :src="q.videoUrl" frameborder="0" allowfullscreen v-if="q.videoUrl !== ''"></iframe>
          <img :src="q.photoUrl" v-if="q.photoUrl !== ''"/>
        </div>
        <div class="links" v-if="q.linkUrl !== ''">
          <a :href="q.linkUrl">{{q.linkName}}</a>
        </div>
        <div class="info">
          Added under <span class="category" @click="setCategory(q.category)">{{q.category}}</span>,
          by <span class="details"> {{q.name}}</span><br />
          <timeago class="post-time" :since="q.time" :auto-update="1"></timeago>
        </div>
      </li>
    </transition-group>
    <input autocomplete="off" placeholder="" class="poll-search animated slideInLeft" v-model="search" />
  </div>
</template>
<script>
  require('../../node_modules/velocity-animate/velocity.ui')
  import io from 'socket.io-client'
  var socket = io()
  import Vue from 'vue'
  import _ from 'lodash'
  import $ from 'jquery'
  import VueTimeago from 'vue-timeago'
  import Velocity from 'velocity-animate'

  Vue.use(VueTimeago)

  Vue.filter('space', function (value) {
    return value.replace(/\-/g, ' ') // eslint-disable-line no-useless-escape
  })

  Vue.filter('cap', function (value) {
    return _.upperFirst(value)
  })
  export default {
    data () {
      return {
        questions: [],
        height: $(window).height(),
        itemHeight: '40%',
        offline: false
      }
    },
    watch: {
      height: function () {
        if (this.height >= 1100) {
          this.itemHeight = '20%'
        }
        if (this.height >= 900 && this.height < 1100) {
          this.itemHeight = '30%'
        }
        if (this.height > 800 && this.height < 900) {
          this.itemHeight = '35%'
        }
        if (this.height < 800) {
          this.itemHeight = '40%'
        }
      }
    },
    computed: {
      search: function () {
        return this.$parent.search
      },
      fade: function () {
        $('.feed-stream').scroll(function () {
          if ($('.question').offset().top - $('.feed-stream').scrollTop() < 100) {
            return true
          }
        })
      },
      orderedList: function () {
        var that = this
        var ol = _.orderBy(this.questions, ['time'], ['desc'])

        return ol.filter(function (q) {
          return q.question.toLowerCase().indexOf(that.search.toLowerCase()) !== -1
        })
      }
    },
    props: ['add-overlay'],
    methods: {
      setCategory (category) {
        this.$parent.currentCategory = category
        this.$router.push('/category')
      },
      beforeEnter: function (el) {
        el.style.height = 0
        el.style.opacity = 0
      },
      enter: function (el, done) {
        var delay = el.dataset.index * 150
        if (this.height > 1100) {
          setTimeout(function () {
            Velocity(el, { height: '20%', opacity: 1 }, { complete: done })
          }, delay)
        }
        if (this.height >= 900 && this.height < 1100) {
          setTimeout(function () {
            Velocity(el, { height: '30%', opacity: 1 }, { complete: done })
          }, delay)
        }
        if (this.height > 800 && this.height < 900) {
          setTimeout(function () {
            Velocity(el, { height: '35%', opacity: 1 }, { complete: done })
          }, delay)
        }
        if (this.height < 800) {
          setTimeout(function () {
            Velocity(el, { height: '40%', opacity: 1 }, { complete: done })
          }, delay)
        }
      },
      leave: function (el, done) {
        var delay = el.dataset.index * 0
        setTimeout(function () {
          Velocity(el, { height: 0, opacity: 0 }, { complete: done })
        }, delay)
      }
    },
    mounted: function () {
      var that = this

      if (!window.navigator.onLine) {
        this.offline = true
      }

      $(window).resize(function () {
        that.height = $(window).height()
      })

      this.$http.get('/getQuestions').then(function (res) {
        if (res.data.msg === 'Loaded questions!') {
          for (let value of res.data.data) {
            this.questions.push(value)
          }
        }
      })

      socket.on('update list', function () {
        that.$http.get('/getQuestions').then(function (res) {
          if (res.data.msg === 'Loaded questions!') {
            that.questions = res.data.data
          }
        })
      })
    }
  }
</script>
<style scoped>
  ::-webkit-scrollbar {
    width: .1px;
    height: 2px;
  }

  ::-webkit-scrollbar-thumb {
    background: transparent;
    -webkit-border-radius: 5px;
    border-radius: 5px;
  }

  a, a:visited {
    text-decoration: none;
    color: #fff;
  }

  .list-container {
    position: absolute;
    top: 90%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -90%);
    width: 90%;
    height: 90%;
    box-sizing: border-box;
  }

  ul {
    position: absolute;
    top: 90%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -90%);
    width: 90%;
    height: 90%;
    margin: 0;
    list-style: none;
    padding: 0;
    box-sizing: border-box;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    text-align: center;
  }

  li {
    text-align: left;
    width: 18%;
    height: 40%;
    margin: 20px 25px;
    padding: 10px;
    display: inline-block;
    overflow-y: scroll;
    border-radius: 5px;
  }

  li:hover {
    box-shadow: 0 1px 6px rgba(0,0,0,.34);
  }

  li:hover .title {
    background-color: rgba(0,171,108, .7);
  }

  .fading {
    opacity: 0;
  }

   .title {
    color: #fff;
    background-color: transparent;
    font-family: 'Lato', sans-serif;
    font-size: 18px;
    font-weight: normal;
    text-align: center;
    border: 2px solid transparent;
    border-radius: 5px;
    cursor: pointer;
    padding: 10px;
    margin: 0;
    margin-bottom: 20px;
    word-wrap: break-word;
    transition: all .5s ease-in-out;
  }

   iframe, img {
    width: 99.5%;
    box-shadow: 0 2px 2px rgba(0,0,0,.14);
    border-radius: 5px;
    margin-top: 20px;
  }

   .description {
    color: white;
    background-color: ;
    box-shadow: 0 -2px 7px rgba(0,0,0,.14);
    border-radius: 5px;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif;
    font-size: 14px;
    padding: 10px;
    text-align: justify;
    margin-top: 20px;
    word-wrap: break-word;
  }

   .links {
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif;
    font-size: 12px;
    margin-top: 40px;
    margin-bottom: 20px;
    text-align: center;
  }

  .links a {
    color: #ff4433;
    text-decoration: none;
    border: 2px solid #ff4433;
    padding: 5px;
    border-radius: 3px;
    transition: all .5s ease-in-out;
    -webkit-transition: all .5s ease-in-out;
  }

   .info {
     text-align: center;
     color: #ccc;
     font-size: 12px;
     margin-top: 40px;
     margin-bottom: 10px;
     font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif;
   }

   .category {
     font-family: 'Roboto', sans-serif;
     font-size: 14px;
     color: #3798A0;
     cursor: pointer;
     margin: 0;
   }

   .details {
    margin: 0;
    font-family: 'Lato', sans-serif;
    border-bottom: 2px dotted;
    font-size: 14px;
    color: #fff;
  }

   .stats {
    text-align: center;
  }

   .stats .talking {
    font-family: 'Lato', sans-serif;
    color: #F55737;
    font-size: 15px;
    border: 2px solid;
    padding: 5px;
    min-width: 12%;
    border-radius: 5px;
    display: inline-block;
    margin: 0;
    margin-right: 20px;
  }

   .stats .clips {
    font-family: 'Lato', sans-serif;
    font-size: 15px;
    color: #36a2eb;
    border: 2px solid;
    border-radius: 5px;
    padding: 5px;
    min-width: 12%;
    margin: 0;
    margin-right: 20px;
    display: inline-block;
  }

   .stats .answers {
    font-family: 'Lato', sans-serif;
    font-size: 15px;
    color: #EF9A30;
    display: inline-block;
    border: 2px solid;
    padding: 5px;
    min-width: 12%;
    border-radius: 5px;
  }

   .stats canvas {
    width: 40%;
    display: inline-block;
    border: 2px solid;
    margin: 0;
  }

  .poll-search {
    background-image: url('../assets/search.svg');
    background-color: transparent;
    background-position: 10px 8px;
    background-repeat: no-repeat;
    background-size: 15px;
    border: 2px solid rgba(255, 255, 255, .5);
    font-family: 'Lato', sans-serif;
    font-size: 18px;
    padding-left: 35px;
    padding-top: 4px;
    padding-bottom: 4px;
    border-radius: 50px;
    color: #fff;
    width: 10%;
    position: absolute;
    top: 3.9%;
    left: 59%;
    transition: all .5s ease-in-out;
    display: none;
  }

  .poll-search:focus {
    border: 2px solid rgba(255, 255, 255, 1);
  }

  .hide {
    display: none;
  }

  .opacity {
    filter: blur(3px);
  }

  @media screen and (max-width: 900px) {
    li {
      width: 30%;
    }
  }

  @media screen and (max-width: 600px) {
    li {
      width: 60%;
    }
  }
</style>
