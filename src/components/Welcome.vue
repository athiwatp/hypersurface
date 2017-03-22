<template>
  <div class="container">
    <section class="welcome auto-text" v-show="slide === 1">
      <p class="welcome-text animated fadeInUp">Welcome to hypersurface.</p>
    </section>

    <section class="name" v-show="slide === 2">
      <form  class="name-form" @submit.prevent="login(name)">
        <p class="name-text animated fadeInDown">What name would you like to be called?</p>
        <input
          class="inputs animated flipInX"
          v-focus="nameInput"
          autocomplete="off"
          v-model="name"
          @input="typingName = true"
          @keyup="letters()"
        />
        <button class="submit-button animated fadeInUp" @click="login(name)">Confirm</button>
      </form>
      <div class="name-tip" v-show="typingName">
        <p class="animated fadeInUp">
          <i class="fa fa-exclamation-circle"></i><span>Tip</span>: Don't worry, there are no set usernames.
          We encourage you to use the name your most confortable going by.
        </p>
      </div>
    </section>

    <section class="nice auto-text" v-show="slide === 3">
      <p class="meet animated fadeInUp">Nice to meet you, {{name | cap}}.</p>
    </section>

    <section class="tour-request" v-show="slide === 4">
      <form class="tour-form" @submit.prevent="ifTour()">
        <p class="tour-question animated fadeInDown">Would you like a quick tour of how everything works?</p>
        <input class="inputs tour-input animated flipInX" autocomplete="off" v-model="tourAnswer" v-focus="tourInput" />
      </form>
      <div class="tour-tip" v-show="invalidResponse">
        <p class="animated fadeInUp">
          <i class="fa fa-exclamation-circle"></i>Not quite sure what that means. Is that a Yes or a No?
        </p>
      </div>
    </section>
    <tour v-show="tour" v-on:ready="finishedTour()"></tour>
    <section class="all-set auto-text" v-show="slide === 5">
      <p class="great animated fadeInUp">Great, you're all set. We can't wait to hear your opinion!</p>
    </section>
  </div>
</template>
<script>
  import Auth from '../../config/auth'
  import { focus } from 'vue-focus'
  import Tour from './Tour'
  import _ from 'lodash'
  import Vue from 'vue'

  Vue.filter('cap', function (value) {
    return _.upperFirst(value)
  })

  export default {
    data () {
      return {
        slide: 1,
        typingName: false,
        nameInput: false,
        tourInput: false,
        tour: false,
        invalidResponse: false,
        tourAnswer: '',
        name: ''
      }
    },
    directives: {
      focus: focus
    },
    components: {
      'tour': Tour
    },
    methods: {
      login (name) {
        if (this.name !== '' && this.name.length < 12) {
          Auth.checkForStorage(this)
          Auth.logout()
          Auth.saveName(this, name)
          this.nameInput = false
          this.slide = 3
          var that = this
          setTimeout(function () {
            that.slide = 4
            that.tourInput = true
          }, 3000)
        } else {
          this.$emit('help', 'invalid name')
        }
      },
      ifTour () {
        var that = this

        var positive = ['yes', 'sure', 'ok', 'yeah', 'yea', 'all right', 'yup', 'okay']
        var negative = ['no', 'no thanks', 'nah']

        if (positive.indexOf(this.tourAnswer.toLowerCase()) !== -1) {
          this.slide = 0
          this.tour = true
        } else {
          if (negative.indexOf(this.tourAnswer.toLowerCase()) !== -1) {
            this.slide = 5
            setTimeout(function () {
              Auth.stayLoggedIn()
              that.$parent.login()
              that.$router.push('/')
            }, 4000)
          } else {
            this.invalidResponse = true
          }
        }
      },
      finishedTour () {
        let that = this
        this.tour = false
        this.slide = 5
        setTimeout(function () {
          Auth.stayLoggedIn()
          that.$parent.login()
          that.$router.push('/')
        }, 4000)
      },
      letters () {
        this.name = this.name.replace(/[^A-Za-z]/, ' ')
      }
    },
    mounted: function () {
      var that = this
      setTimeout(function () {
        that.slide = 2
        that.nameInput = true
      }, 4000)
    }
  }
</script>
<style scoped>
  .auto-text {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -45%);
    color: #fff;
    font-family: 'Lato', sans-serif;
    font-size: 2rem;
    text-align: center;
    width: 50%;
  }

  .welcome-text {
    animation-duration: 3s;
  }

  .name-form {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -30%);
    color: #fff;
    font-family: 'Lato', sans-serif;
    font-size: 1.5rem;
    text-align: center;
    width: 40%;
  }

  .inputs {
    background-color: transparent;
    box-shadow: none;
    border: 0;
    color: #fff;
    font-family: 'Lato', sans-serif;
    font-weight: bold;
    font-size: 2rem;
    padding: 10px;
    text-align: center;
    margin-top: 5rem;
    margin-bottom: 4rem;
    width: 70%;
    box-sizing: border-box;
  }

  .submit-button {
    display: none;
    border: 0;
    border-radius: 5px;
    background-color: rgba(0,171,108, .75);
    color: #fff;
    outline: none;
    padding: .5rem;
    padding-left: 1rem;
    padding-right: 1rem;
    font-family: 'Lato', sans-serif;
    font-size: 1rem;
  }

  .name-text,
  .tour-question {
    margin: 0;
  }

  .name-tip,
  .tour-tip {
    position: absolute;
    top: 70%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -80%);
    color: #fff;
    font-family: 'Lato', sans-serif;
    font-size: .825rem;
    font-weight: normal;
    width: 50%;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
    padding: .5rem;
    border-radius: 5px;
    text-align: center;
  }

  .name-tip i,
  .tour-tip i {
    margin-right: .5rem;
  }

  .name-tip span {
    font-weight: bold;
  }

  .tour-form {
    position: absolute;
    top: 40%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -40%);
    color: #fff;
    font-family: 'Lato', sans-serif;
    font-size: 1.5rem;
    text-align: center;
    width: 50%;
  }

  @media screen and (max-width: 1000px) {
    .inputs {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 5px;
    }
  }

  @media screen and (min-width: 400px) and (max-width: 999px) {
    .inputs {
      margin-top: 4rem;
    }
  }

  @media screen and (max-width: 508px) {
    .auto-text {
      font-size: 1.5rem;
      width: 70%;
    }

    .name-form,
    .tour-form {
      position: absolute;
      top: 35%;
      left: 50%;
      transform: translate(-50%, -35%);
      width: 50%;
    }

    .inputs {
      width: 100%;
      font-size: 1.5rem;
    }

    .name-text,
    .tour-question {
      font-size: 1.25rem;
    }

    .name-tip {
      width: 70%;
    }
  }

  @media screen and (max-width: 350px) {
    .name-text,
    .tour-question {
      font-size: 1rem;
    }

    .name-tip {
      font-size: .625rem;
    }
  }
</style>
