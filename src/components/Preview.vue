<template>
  <div class="preview">
    <div class="container">
      <p class="title">{{pollTitle | cap}}?</p>
      <div class="stats">
        <p class="talking">150</p>
        <span class="clips">26</span>
        <div class="answers">489</div>
      </div>
      <p class="description" v-if="this.description !== ''">{{description}}</p>
      <div class="media">
        <iframe frameborder="0" allowfullscreen :src="embed" v-if="this.embed !== ''"></iframe>
        <img :src="photo" v-if="this.photo !== ''" />
      </div>
      <div class="link" v-if="this.linkName !== ''">
        <a :href="linkUrl">{{linkName}}</a>
      </div>
      <div class="info">
        Added under <span class="category">{{category}}</span>,
        by <span class="name">{{username}}</span>
        <br />
        10 minutes ago
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import _ from 'lodash'

  Vue.filter('cap', function (value) {
    return _.upperFirst(value)
  })
  export default {
    data: function () {
      return {
      }
    },
    props: ['pollTitle', 'category', 'description', 'embed', 'photo', 'link-name', 'link-url', 'username']
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

  .container {
    width: 95%;
    height: 300px;
    background-color: transparent;
    box-shadow: 0 1px 6px rgba(0,0,0,.34);
    padding: 10px;
    margin: 0;
    margin-right: auto;
    margin-left: auto;
    box-sizing: border-box;
    border-radius: 5px;
    overflow-y: scroll;
  }

  .title {
    color: #fff;
    background-color: rgba(0,171,108, .7);
    box-shadow: 0 3px 3px rgba(0,0,0,.14);
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

  .stats {
    text-align: center;
  }

  .stats .talking {
    font-family: 'Lato', sans-serif;
    color: #F55737;
    font-size: 18px;
    border: 2px solid;
    padding: 5px;
    min-width: 15%;
    border-radius: 5px;
    display: inline-block;
    margin: 0;
    margin-right: 20px;
  }

  .stats .clips {
    font-family: 'Lato', sans-serif;
    font-size: 18px;
    color: #36a2eb;
    border: 2px solid;
    border-radius: 50px;
    padding: 5px;
    min-width: 15%;
    margin: 0;
    margin-right: 20px;
    display: inline-block;
  }

  .stats .answers {
    font-family: 'Lato', sans-serif;
    font-size: 18px;
    color: #EF9A30;
    display: inline-block;
    border-bottom: 2px solid;
  }

  .description {
    color: #fff;
    background-color: ;
    box-shadow: 0 -2px 7px rgba(0,0,0,.14);
    border-radius: 5px;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif;
    font-size: 14px;
    padding: 10px;
    text-align: justify;
    margin-top: 20px;
    margin-bottom: 20px;
    word-wrap: break-word;
  }

  iframe, img {
    border: 0;
    width: 99.5%;
    box-shadow: 0 2px 2px rgba(0,0,0,.14);
    border-radius: 5px;
    margin-top: 2rem;
  }

  .link {
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif;
    font-size: 12px;
    margin-top: 10px;
    margin-bottom: 20px;
    text-align: center;
  }

  .link a {
    color: #F55737;
    text-decoration: none;
    border: 2px solid #ff4433;
    padding: 5px;
    border-radius: 3px;
    transition: all .5s ease-in-out;
    -webkit-transition: all .5s ease-in-out;
  }

  .info {
    color: #ccc;
    font-size: 12px;
    margin-top: 40px;
    margin-bottom: 10px;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif;
  }

  .category {
    font-family: 'Roboto', sans-serif;
    font-weight: bold;
    font-size: 14px;
    color: #3798A0;
    margin: 0;
  }

  .name {
    margin: 0;
    font-family: 'Lato', sans-serif;
    border-bottom: 2px dotted;
    font-size: 14px;
    color: #fff;
  }
</style>
