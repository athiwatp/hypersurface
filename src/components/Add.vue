<template>
  <div class="add">
    <div class="container">
      <h2>Create a new question</h2>
      <div class="animated form-buttons" v-show="!preview">
        <p
          class="form-btn"
          :class="{ 'selected': label === 'Title' }"
          @click="setTitle()"
        >
          Title
        </p>
        <p
          class="form-btn"
          :class="{ 'selected': label === 'Category' }"
          @click="setCategory()"
        >
          Category
        </p>
        <p
          class="form-btn"
          :class="{ 'selected': label === 'Description' }"
          @click="setDescription()"
        >
          Description
        </p>
        <p
          class="form-btn mb0"
          :class="{ 'selected': label === 'Embed' }"
          @click="setEmbed()"
        >
          Embed
        </p>
        <p
          class="form-btn mb0"
          :class="{ 'selected': label === 'Photo' }"
          @click="setPhoto()"
        >
          Photo
        </p>
        <p
          class="form-btn mb0"
          :class="{ 'selected': label === 'Link' }"
          @click="setLink()"
        >
          Link
        </p>
      </div>
      <form>
        <div class="field" v-show="!preview">
          <label class="form-label animated" for="form-input">{{label}}</label>
          <input
            id="form-input"
            class="input animated"
            autofocus=""
            placeholder="Title"
            v-model="title"
            v-show="label === 'Title'"
          />
          <input
            id="form-input"
            class="input animated"
            autofocus=""
            placeholder="Category"
            v-model="category"
            v-show="label === 'Category'"
          />
          <textarea
            id="form-input"
            class="input description-input animated"
            autofocus=""
            placeholder="Description"
            v-model="description"
            v-show="label === 'Description'"
          >
          </textarea>
          <input
            id="form-input"
            class="input animated"
            autofocus=""
            placeholder="Embed url"
            v-model="embed"
            v-show="label === 'Embed'"
          />
          <input
            id="form-input"
            class="input animated"
            autofocus=""
            placeholder="Photo url"
            v-model="photo"
            v-show="label === 'Photo'"
          />
          <input
            id="form-input"
            class="input inline animated link1"
            autofocus=""
            placeholder="Link name"
            v-model="linkName"
            v-show="label === 'Link'"
          />
          <input
            id="form-input"
            class="input inline animated"
            placeholder="Link url"
            v-model="linkUrl"
            v-show="label === 'Link'"
          />
        </div>
        <br />
        <poll-preview
          :poll-title="title"
          :category="category"
          :description="description"
          :embed="embed"
          :photo="photo"
          :link-name="linkName"
          :link-url="linkUrl"
          :username="currentName"
          :style="{marginBottom: '2rem'}"
          v-show="preview"
        >
        </poll-preview>
        <button class="button animated preview-btn" @click.prevent="showPreview()">{{previewText}}</button>
        <button class="button animated submit-btn" @click.prevent="submit()" v-show="!preview">Create</button>
      </form>
      <div class="close-clips" @click="close()">
          <i class="fa fa-close"></i>
      </div>
      <div class="help" @click="getHelp()">
        <i class="fa fa-question-circle-o"></i>
      </div>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'
  import Preview from './Preview'
  import io from 'socket.io-client'
  var socket = io()
  export default {
    data: function () {
      return {
        label: 'Title',
        title: '',
        category: '',
        description: '',
        embed: '',
        photo: '',
        linkName: '',
        linkUrl: '',
        preview: false,
        name: '',
        unusable: false
      }
    },
    watch: {
      label: function () {
        $('.form-label').addClass('fadeInUp')
        $('.input').addClass('fadeInDown')
        $('.button').addClass('slideInDown')
        setTimeout(function () {
          $('.form-label').removeClass('fadeInUp')
          $('.input').removeClass('fadeInDown')
          $('.button').removeClass('slideInDown')
        }, 1000)
      }
    },
    computed: {
      previewText: function () {
        if (!this.preview) {
          return 'Preview'
        } else {
          return 'Hide preview'
        }
      }
    },
    components: {
      'poll-preview': Preview
    },
    props: ['current-name'],
    methods: {
      close: function () {
        this.$emit('close')
      },
      characters () {
        this.title = this.title.replace(/[^A-Za-z\d ]/, '')
        this.category = this.category.replace(/[^A-Za-z\d ]/, '')
      },
      setTitle: function () {
        this.label = 'Title'
      },
      setCategory: function () {
        this.label = 'Category'
      },
      setDescription: function () {
        this.label = 'Description'
      },
      setEmbed: function () {
        this.label = 'Embed'
      },
      setPhoto: function () {
        this.label = 'Photo'
      },
      setLink: function () {
        this.label = 'Link'
      },
      showPreview: function () {
        if (!this.preview) {
          this.preview = true
        } else {
          this.preview = false
        }
      },
      submit: function () {
        var unusable = ['.', '^', '[', ']', '`', '{', '}', '|', '!', '*', ';', '/', '?', '(', ')']
        for (let letter of this.title) {
          for (let value of unusable) {
            if (letter === value) {
              this.unusable = true
            }
          }
        }
        if (this.unusable === true || this.title === '' || this.category === '') {
          this.$emit('help', 'Field error')
        } else {
          var d = new Date()
          var title = this.title.trim()

          var params = {
            question: title.replace(/ /g, '-'),
            category: this.category.toLowerCase(),
            name: this.currentName,
            description: this.description.trim(),
            videoUrl: this.embed,
            photoUrl: this.photo,
            linkUrl: this.linkUrl,
            linkName: this.linkName,
            date: d.toDateString(),
            time: d.toLocaleString('en-US', {timeZone: 'America/New_York'}),
            responses: [],
            clips: 0,
            numUsers: 0,
            totalResponses: 0
          }

          params = JSON.stringify(params)

          this.$http.post('/addQuestion', params).then(function (res) {
            if (res.data.msg === 'Added question!') {
              socket.emit('new question')
              this.$emit('close')
              this.$emit('help', 'success')
              this.title = ''
              this.category = ''
              this.description = ''
              this.embed = ''
              this.photo = ''
              this.linkName = ''
              this.linkUrl = ''
              this.$router.push('feed')
            } else {
              this.$emit('help', 'duplicate')
            }
          })
        }
      },
      getHelp: function () {
        this.$emit('help', this.label)
      }
    }
  }
</script>
<style scoped>
  .add {
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

  .add .mb0 {
    margin-bottom: 0;
  }

  .container {
    height: 98%;
    overflow-y: scroll;
  }

  .container::-webkit-scrollbar-thumb {
    background-color: transparent;
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

  .form-btn {
    display: inline-block;
    color: #fff;
    font-family: 'Lato', sans-serif;
    font-size: 14px;
    margin-left: 10px;
    margin-right: 10px;
    cursor: pointer;
  }

  .field {
    display: inline-block;
    margin: 10px;
    margin-top: 50px;
  }

  label {
    color: #fff;
    font-family: 'Lato', sans-serif;
    font-size: 36px;
    margin-top: 10px;
    display: block;
  }

  input {
    color: #fff;
    font-size: 18px;
    font-family: 'Lato', sans-serif;
    background-color: transparent;
    border: 0;
    border-bottom: 2px solid;
    margin-top: 40px;
    margin-bottom: 50px;
    width: 90%;
    padding: 5px;
    padding-left: 0;
    transition: all 1s ease-in-out;
  }

  input:focus {
  }

  .description-input {
    width: 95%;
    height: 150px;
    border: 0;
    background-color: transparent;
    outline: none;
    color: #fff;
    font-family: 'Lato', sans-serif;
    font-size: 18px;
    box-shadow: 0 3px 10px rgba(0,0,0,.34);
    box-sizing: border-box;
    margin-top: 40px;
    margin-bottom: 15px;
  }

  .inline {
    width: 150px;
    margin-left: 10px;
    margin-right: 10px;
    display: inline-block;
  }

  ::-webkit-input-placeholder {
  color: rgba(255, 255, 255, 0.5);
  }

  ::-moz-placeholder {
  color: rgba(255, 255, 255, 0.5);
  }

  :-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.5);
  }

  :-moz-placeholder {
  color: rgba(255, 255, 255, 0.5);
  }

  button {
    color: rgba(255, 255, 255, .5);
    background-color: transparent;
    cursor: pointer;
    border: 0;
    font-family: 'Lato', sans-serif;
    font-size: 18px;
    border-radius: 5px;
    margin-top: 0rem;
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 3rem;
    padding: 10px;
    border: 2px solid;
  }

  .preview-btn {
    transition: all .3s ease-in-out;
  }

  .preview-btn:hover {
    color: rgb(255, 255, 255);
    border: 2px solid rgb(255, 255, 255);
  }

  .close-clips {
    position: absolute;
    top: 93%;
    left: 50%;
    transform: translate(-50%, -93%);
    display: inline-block;
    color: #fff;
    width: 20px;
    height: 20px;
    padding: .5rem;
    border-radius: 50%;
    background-color: #F55737;
    cursor: pointer;
    transition: all .5s ease-in-out;
  }

  .close-clips i {
    position: absolute;
    top: 49%;
    left: 50%;
    transform: translate(-50%, -49%);
    padding: 0;
  }

  .selected {
    border-bottom: 2px solid #fff;
  }

  .help {
    position: absolute;
    top: 95%;
    left: 85%;
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    box-sizing: border-box;
    transition: all .5s ease-in-out;
  }

  .help:hover {
    color: #fff;
  }

  @media screen and (max-width: 1250px) {
    .add {
      width: 30%;
    }
  }

  @media screen and (max-width: 800px) {
    .add {
      width: 40%;
    }
  }

  @media screen and (max-width: 650px) {
    .field input {
      background-color: rgba(0, 0, 0, 0.2);
      border-bottom: 0;
      padding: .5rem;
      margin-top: 2rem;
      margin-bottom: 2rem;
    }

    .field textarea {
      background-color: rgba(0, 0, 0, 0.2);
    }

    h2 {
      margin: 0;
    }

    .add {
      width: 65%;
    }

    .help {
      display: none;
    }
  }

  @media screen and (max-width: 400px) {
    .form-btn {
      font-size: .825rem;
    }

    input {
      margin-top: 2rem;
      margin-bottom: 2rem;
    }

    label {
      font-size: 2rem;
    }
  }

  @media screen and (max-width: 350px) {
    h2 {
      font-size: 1rem;
    }

    .field {
      margin-top: 1.5rem;
    }

    .form-btn {
      font-size: .625rem;
    }

    input {
      font-size: 1rem;
    }

    .link1 {
      margin-bottom: .5rem;
    }

    label {
      margin-top: 0;
      font-size: 1.5rem;
    }

    .description-input {
      font-size: 1rem;
      margin-top: 1.5rem;
    }

    button {
      font-size: .825rem;
    }

    .close-clips {
      width: 15px;
      height: 15px;
    }
  }

  @media screen and (min-width: 700px) and (max-height: 600px) {
    .field {
      margin-top: 1.5rem;
    }

    label {
      margin-top: 0;
      font-size: 1.5rem;
    }

    .link1 {
      margin-bottom: .5rem;
    }

    button {
      margin-top: 0;
    }

    .help {
      display: none;
    }
  }
</style>
