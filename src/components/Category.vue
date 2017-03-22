<template>
  <div class="category-main">
    <input class="category-search" autocomplete="on" autofocus="" disabled="" v-model="search"/>
    <div class="other-categories">

    </div>
    <div class="results">
      <div class="buttons">
        <p class="num-questions">Questions in this category: {{categoryTotal}}</p>
        <button class="results-btn shuffle-btn" @click="shuffle()"><i class="fa fa-random"></i><span>Shuffle</span></button>
      </div>
      <ul class="results-list">
        <transition-group name="flip-list" tag="ul">
          <li class="item" v-for="r in results" :key="r">
            <router-link :to="{name: 'question', params: {question: r.question}}">
              <div class="li-container">
                {{r.question | space | cap}}?<br />
                <p class="description"><span v-if="!description(r.description)">No description</span>{{r.description}}</p><br />
                <p class="responses">Responses: {{r.totalResponses}}</p>
                <span class="date">{{r.date}}</span>
                <span class="author">By, {{r.name}}</span>
              </div>
            </router-link>
          </li>
        </transition-group>
      </ul>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import _ from 'lodash'

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
        questions: null,
        results: [],
        search: this.$parent.currentCategory
      }
    },
    computed: {
      categoryTotal () {
        return this.results.length
      }
    },
    methods: {
      shuffle () {
        this.results = _.shuffle(this.results)
      },
      description (response) {
        if (response !== '') {
          return true
        } else {
          return false
        }
      }
    },
    mounted: function () {
      this.$http.get('/getQuestions').then(function (res) {
        if (res.data.msg === 'Loaded questions!') {
          for (let value of res.data.data) {
            if (value.category === this.$parent.currentCategory) {
              this.results.push(value)
              this.results.sort(function (a, b) {
                return new Date(b.time) - new Date(a.time)
              })
            }
          }
        }
      })
    }
  }
</script>
<style scoped>
  ul {
    padding: 0;
  }

  a, a:visited {
    text-decoration: none;
    color: #fff;
  }

  ::-webkit-scrollbar {
    width: 4px;
    height: 2px;
  }

  ::-webkit-scrollbar-thumb {
    background: transparent;
    -webkit-border-radius: 5px;
    border-radius: 5px;
  }

  .category-search {
    position: absolute;
    top: 13%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -13%);
    background-color: transparent;
    border: 0;
    border-bottom: 2px solid rgba(255, 255, 255, 0.5);;
    font-family: 'Lato', sans-serif;
    font-size: 24px;
    padding: 10px;
    padding-left: 0;
    color: #fff;
    width: 80%;
  }

  .results-list {
    position: absolute;
    top: 75%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -75%);
    width: 80%;
    height: 60%;
    padding: 0;
    list-style: none;
    overflow-y: scroll;
    text-align: center;
  }

  .item {
    font-family: 'Lato', sans-serif;
    font-size: 18px;
    font-weight: 900;
    border-radius: 5px;
    color: #fff;
    margin: 10px;
    margin-top: 15px;
    margin-bottom: 20px;
    display: inline-block;
    padding: 10px;
    cursor: pointer;
    transition: all  .2s ease-in-out;
    min-width: 20%;
    max-width: 20%;
    text-align: center;
    clear: both;
  }

  .item .description {
    font-family: 'Lato', sans-serif;
    font-size: 15px;
    font-weight: normal;
    margin-bottom: 0;
    overflow-y: scroll;
    height: 7rem;
    padding: .25rem;
    border-radius: 5px;
    box-shadow: 0 -2px 7px rgba(0, 0, 0, .14);
  }

  .item .description span {
    font-size: 12px;
    color: rgba(255, 255, 255, .5);
    font-style: italic;
  }

  .item .responses {
    border: 2px solid;
    font-size: 15px;
    border-radius: 5px;
    padding: 10px;
    margin-top: 0;
    text-align: center;
  }

  .item .date {
    font-size: 12px;
    color: rgba(255, 255, 255, .5);
    float: left;
  }

  .item .author {
    font-size: 12px;
    color: rgba(255, 255, 255, .5);
    float: right;
    overflow-x: scroll;
  }

  .item:hover {
    background-color: #3798A0;
  }

  .flip-list-move {
    transition: transform 1s;
  }

  .buttons {
    position: absolute;
    top: 25%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -23%);
  }

  .num-questions {
    font-family: 'Lato', sans-serif;
    font-size: 2rem;
    color: #fff;
    margin: 0;
    margin-right: 2rem;
    display: inline-block;
    vertical-align: middle;
  }

  .shuffle-btn {
    background-color: rgba(255,99,132,1);
    border: 0;
    font-family: 'Lato', sans-serif;
    font-size: 15px;
    color: #fff;
    padding: 10px;
    border-radius: 5px;
    margin-right: 20px;
    cursor: pointer;
    transition: all .3s ease-in-out;
    display: inline-block;
    vertical-align: middle;
  }

  .shuffle-btn i {
    margin-right: .5rem;
  }

  .results-btn:hover {
  }

  @media screen and (max-width: 1000px) {
    .item {
      width: 30%;
      max-width: 30%;
    }
  }

  @media screen and (max-width: 700px) {
    .num-questions {
      font-size: 1rem;
      margin-right: 0;
    }

    .shuffle-btn {
      display: none;
    }

    .item {
      width: 70%;
      max-width: 70%;
    }
  }
</style>
