<template>
  <div class="search-dropdown">
    <div class="container">
      <h2>Search results</h2>
      <ul class="search-results">
        <input class="small-screen-search" v-model="currentSearch">
        <transition-group
          name="staggered-fade"
          v-bind:css="false"
          v-on:before-enter="beforeEnter"
          v-on:enter="enter"
          v-on:leave="leave"
        >
        <li class="poll-link"
          v-for="(r, index) in orderedList"
          :key="r"
          v-bind:data-index="index"
        >
          <div class="details">
            <h3 class="title" @click="goToPoll(r.question)">{{r.question | space | cap}}</h3>
            <p class="description">
              <span v-if="!description(r.description)">
                No description
              </span>
              {{r.description}}
            </p>
            <p class="responses">Responses: {{r.totalResponses}}</p>
          </div>
          <div class="credit">
            Asked on <span class="date">{{r.date}}</span><br />
            by <span class="poster">{{r.name}}</span>
          </div>
        </li>
        </transition-group>
      </ul>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import _ from 'lodash'
  import Velocity from 'velocity-animate'

  Vue.filter('space', function (value) {
    return value.replace(/\-/g, ' ') // eslint-disable-line no-useless-escape
  })

  Vue.filter('time', function (value) {
    return value.getFullYear()
  })

  Vue.filter('cap', function (value) {
    return _.capitalize(value)
  })
  export default {
    data () {
      return {
        questions: []
      }
    },
    props: ['current-search'],
    computed: {
      orderedList: function () {
        var that = this
        var ol = this.questions

        if (this.currentSearch === '') {
          return []
        } else {
          return ol.filter(function (r) {
            return r.question.toLowerCase().indexOf(that.currentSearch.toLowerCase()) !== -1
          })
        }
      }
    },
    methods: {
      description (response) {
        if (response !== '') {
          return true
        } else {
          return false
        }
      },
      goToPoll (question) {
        var that = this
        this.$router.push('feed')
        setTimeout(function () {
          that.$router.push('/' + question)
        }, 500)
      },
      beforeEnter: function (el) {
        el.style.height = 0
        el.style.opacity = 0
      },
      enter: function (el, done) {
        var delay = el.dataset.index * 150
        setTimeout(function () {
          Velocity(el, { height: '35%', opacity: 1 }, { complete: done })
        }, delay)
      },
      leave: function (el, done) {
        var delay = el.dataset.index * 0
        setTimeout(function () {
          Velocity(el, { height: 0, opacity: 0 }, { complete: done })
        }, delay)
      }
    },
    mounted () {
      this.$http.get('/getQuestions').then(function (res) {
        if (res.data.msg === 'Loaded questions!') {
          for (let value of res.data.data) {
            this.questions.push(value)
          }
        }
      })
    }
  }
</script>
<style scoped>
  .container {
    position: absolute;
    top: 0%;
    left: 100%;
    margin: 0;
    margin-right: -50%;
    transform: translate(-100%, 0%);
    width: 21%;
    height: 100%;
    box-sizing: border-box;
    box-shadow: 0 3px 10px rgba(0,0,0,.34);
    border-radius: 5px;
    padding: 10px;
    padding-left: 13px;
    background: rgb(63, 105, 181);
    text-align: center;
  }

  h2 {
    color: #fff;
    font-family: 'Lato', sans-serif;
    font-size: 18px;
    font-weight: normal;
    padding-left: 15px;
    background-color: rgba(0,171,108, .7);
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    margin-top: .5rem;
  }

  ul {
    list-style: none;
    padding: 0;
    height: 90%;
    overflow-y: scroll;
    margin: 0;
  }

  ul::-webkit-scrollbar-thumb {
    background-color: transparent;
  }

  ul input {
    color: #fff;
    background-color: rgba(0,0,0,.2);
    border: 0;
    border-radius: 5px;
    padding: .5rem;
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  li {
    text-align: center;
    cursor: pointer;
    width: 95%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 6rem;
    padding: .25rem;
  }

  .title {
    color: #fff;
    font-family: 'Lato', sans-serif;
    font-size: 1.25rem;
    font-weight: normal;
  }

  .description {
    color: rgba(255, 255, 255, .7);
    font-family: 'Lato', sans-serif;
    font-size: .825rem;
    font-weight: normal;
    overflow-y: scroll;
    height: 7rem;
    padding: .25rem;
    border-radius: 5px;
    box-shadow: 0 -2px 7px rgba(0, 0, 0, .14);
  }

  .responses {
    display: inline-block;
    width: 80%;
    color: #fff;
    border: 2px solid;
    padding: .5rem;
    border-radius: 5px;
    font-family: 'Lato', sans-serif;
    font-size: .1.25rem;
  }

  .credit {
    color: rgba(255, 255, 255, .7);
    font-family: 'Lato', sans-serif;
    font-size: .825rem;
    font-weight: normal;
  }

  .poster {
    color: #fff;
    font-weight: bold;
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
    transition: all .5s ease-in-out;
    text-align: center;
  }

  .close-clips i {
    padding-top: .08rem;
  }

  @media screen and (max-width: 1250px) {
    .container {
      width: 30%;
    }
  }

  @media screen and (max-width: 800px) {
    .container {
      width: 40%;
    }
  }

  @media screen and (max-width: 500px) {
    .container {
      width: 65%;
    }
  }
</style>
