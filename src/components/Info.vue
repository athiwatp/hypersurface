<template lang="html">
  <div class="info">
    <div class="info-container" v-show="!tour">
      <div class="info-links">
        <h2 @click="tour = true">Take the tour</h2>
        <a href="https://github.com/aswdesign/hypersurface"><h2>Source code (Github)</h2></a>
        <h2 @click="tech()">Technologies</h2>
        <transition
          name="techlist"
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <div class="tech-stack" v-show="showtech">
            <a href="http://vuejs.org"><p>Vue</p></a>
            <a href="http://socket.io"><p>Socket io</p></a>
            <a href="http://webpack.js.org"><p>Webpack</p></a>
            <a href="http://mongoosejs.com"><p>Mongoose</p></a>
            <a href="http://sacha.me/Countable/"><p>Countable</p></a>
            <a href="http://numeraljs.com"><p>Numeral</p></a>
            <a href="http://velocityjs.org"><p>Velocity</p></a>
            <a href="http://github.com/NekR/offline-plugin"><p>Offline Plugin</p></a>
          </div>
        </transition>
      </div>
      <div class="info-footer">
        <div class="info-inner inner-big">
          <div class="footer-item contact">
            <p>Designed & built by <span>ASW</span></p>
            <p>asw@a-s-w.design</p>
            <p><a href="http://a-s-w.design">a-s-w.desgn</a></p>
          </div>
        </div>
        <div class="info-inner inner-small def-container">
          <div class="footer-item definition">
            <h4>hypersurface</h4>
            <p>\ˈhī-pər-ˌsər-fəs\</p>
            <i class="noun">noun</i>
            <p class="justify">A generalization of an ordinary two-dimensional surface embedded in three-dimensional space to an (n-1)-dimensional surface embedded in  n-dimensional space. A hypersurface is therefore the set of solutions to a single equation.</p>
            <p class="cite">Rowland, Todd and Weisstein, Eric W. "Hypersurface." From MathWorld--A Wolfram Web Resource. http://mathworld.wolfram.com/Hypersurface.html</p>
          </div>
        </div>
      </div>
    </div>
    <welcome-tour v-show="tour" v-on:ready="tour = false"></welcome-tour>
  </div>
</template>

<script>
import Tour from './Tour'
export default {
  data () {
    return {
      showtech: false,
      tour: false
    }
  },
  components: {
    'welcome-tour': Tour
  },
  methods: {
    tech () {
      if (this.showtech === false) {
        this.showtech = true
      } else {
        this.showtech = false
      }
    }
  }
}
</script>

<style lang="css" scoped>
  .info-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 80%;
    padding: 0 3rem;
    box-sizing: border-box;
    text-align: left;
  }

  .info-container a {
    color: white;
    text-decoration: none;
  }

  .info-links {
    height: 50%;
    box-sizing: border-box;
  }

  .info-links h2, .info-links p {
    color: white;
    font-family: 'Lato', sans-serif;
    font-weight: normal;
    font-size: 2rem;
    cursor: pointer;
  }

  .tech-stack p {
    font-size: .875rem;
  }

  .info-footer {
    display: table;
    width: 100%;
    box-sizing: border-box;
  }

  .info-inner {
    display: table-cell;
    vertical-align: bottom;
    box-sizing: border-box;
    display: inline-block;
  }

  .info-inner .justify {
    text-align: justify;
    margin-top: 1rem;
  }

  .inner-big {
    width: 70%;
  }

  .inner-small {
    width: 30%;
  }

  .footer-item {
    color: white;
    font-family: 'Lato', sans-serif;
    font-size: .875rem;
  }

  .footer-item p {
    margin: 0;
  }

  .contact span {
    font-weight: bold;
  }

  .definition {
    text-align: right;
  }

  .definition .cite {
    padding-top: 1rem;
    font-size: .5rem;
  }

  @media screen and (max-width: 1000px) {
    .def-container {
      display: none;
    }

    .info-links {
      height: 80%;
      box-sizing: border-box;
    }
  }
</style>
