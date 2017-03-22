<template>
  <div class="tour">
    <section class="animated fadeIn" v-show="pageNumber === 1">
      <div class="centered">
        <h2 class="mt0">Hello</h2>
        <p>
          Once again, welcome to hypersurface. My name is <a href="http://a-s-w.design">Andrew</a>.
          I am the creator of hypersurface and will be guiding you through the tour.
          To change pages use the 'back' and 'next' buttons at the bottom.
          When you are ready to enter hypersurface use the 'I'm ready to go' button at the top.
          Don't worry, you can access the tour at anytime in the <b @click="pageNumber = 16">Info view</b>.
        </p>
        <span>Let's get started.</span>
      </div>
    </section>
    <section class="what animated fadeIn" v-show="pageNumber === 2">
      <div class="centered what-text">
        <h2>What is hypersurface?</h2>
        <p>
          Hypersurface is a space for people to ask, answer, talk, and take notes on
          questions that invoke personal opinions. The data from these questions
          is displayed in real time, allowing anyone to impact and discover the current point of view.
        </p>
      </div>
    </section>
    <section class="nav" v-show="pageNumber > 2 && pageNumber < 9">
      <div class="centered area animated fadeIn" v-show="pageNumber === 3">
        <div class="menu-media biggest">
          <img src="../assets/main-view.png">
        </div>
        <div class="menu-description smaller menu-text">
          <h2 class="mt0">Navigating hypersurface</h2>
          <p>
            As you may have noticed you have not been asked for a password, email, or any sort of sensitive information.
            There is also no login page. Your name, responses, clips, and notes are all saved locally to your device.
            From now on when you visit hypersurface you will be sent directly to the <b @click="pageNumber = 3">Main View</b>.
          </p>
        </div>
      </div>
      <div class="centered nav-bar-container animated fadeIn" v-show="pageNumber === 4">
        <img src="../assets/navigation-bar.png">
        <div class="menu-text">
          <h3>Navigation bar</h3>
          <p>
            Fixed at the top of your view is the navigation bar.
            It will be there no matter where you are on hypersurface.
          </p>
          <p>
            Starting from the left, clicking the hypersurface icon will bring you back to the <b @click="pageNumber = 3">Main View</b> from wherever
            you are. If you are in the Main View, using the search bar will filter the questions to match your search.
            However, if you are not on the Main View, using the search bar will open the <b @click="pageNumber = 6">Search Menu</b> displaying clickable search results.
            The 'Add a question' button will open the <b @click="pageNumber = 7">New Question Menu</b>. Lastly, clicking the red circle (with the first letter of your name)
            will open the <b @click="pageNumber = 8">Clip Menu</b>.
          </p>
        </div>
      </div>
      <div class="centered nav-menu-container animated fadeIn" v-show="pageNumber > 4 && pageNumber < 9">
        <div class="nav-menu-text" v-show="pageNumber === 5">
          <h3>Navigation bar menus</h3>
          <p>
            Upon clicking certain elements of the navigation bar one of the following menus will appear:
          </p>
        </div>
        <div class="nav-menu-cell search-menu-conatiner animated fadeIn"  v-show="pageNumber === 6">
          <div class="menu-media">
            <img class="menu-img" src="../assets/search-menu.png">
          </div>
          <div class="menu-description menu-text">
            <h3>Search Menu</h3>
            <p>
              This menu appears when using the search bar while not in the <b @click="pageNumber = 3">Main View</b>.
              As you type, the resulting questions from your query are displayed.
              The resulting questions are clickable and when clicked,
              send you to the <b @click="pageNumber = 11">Poll View</b> of that question.
              Clicking outside of the search bar closes the menu.
            </p>
          </div>
        </div>
        <div class="nav-menu-cell new-question-container animated fadeIn"  v-show="pageNumber === 7">
          <div class="menu-media">
            <img class="menu-img" src="../assets/new-question-menu.png">
          </div>
          <div class="menu-description menu-text">
            <h3>New Question Menu</h3>
            <p>
              This menu appears when the 'Add a question' button is clicked.
              There are six elements that can make up a question:
              title, category, description, embed, photo, and link.
            </p>
            <p>
              Upon clicking the label of a element, the input section for that element will show.
              Only the title and category are required.
              You may preview what your question will look like by clicking the 'Preview' button.
              When you are ready to post, clicking the 'Create' button will submit the question.
              A notification will appear displaying a check mark if the question was added
              or an error message if something went wrong.
              For more info on each element you can click the question mark at the bottom right corner
              to display a help message for that element.
            </p>
          </div>
        </div>
        <div class="nav-menu-cell clip-menu-container animated fadeIn"  v-show="pageNumber === 8">
          <div class="menu-media">
            <img class="menu-img" src="../assets/clip-menu.png">
          </div>
          <div class="menu-description menu-text">
            <h3>Clip Menu</h3>
            <p>
              This menu appears when the red button containing the first letter of your name is clicked.
              This menu displays all of the questions you have clipped.
              Clicking on a question in this menu will take you the <b @click="pageNumber = 15">Clip View</b> for that question.
            </p>
          </div>
        </div>
      </div>
    </section>
    <section class="questions" v-show="pageNumber > 8 && pageNumber < 11">
      <div class="centered animated fadeIn" v-show="pageNumber === 9">
        <h2>Questions</h2>
        <p>
          Questions are the center piece of hypersurface and the <b @click="pageNumber = 3">Main View</b> is where they are displayed.
          As new questions are added, the Main View updates in real time to display the new questions
          and the data within them.
        </p>
      </div>
      <div class="centered question-example animated fadeIn" v-show="pageNumber === 10">
        <div class="menu-media tac">
          <img class="big-img" src="../assets/question.png">
        </div>
        <div class="menu-description menu-text">
          <h3>A Question</h3>
          <p>
            When hovering a question, the title is highlighted and the content of that question becomes scrollable.
            Clicking the title will take you to the <b @click="pageNumber = 11">Poll View</b> of that question.
          </p>
          <p>
            Underneath the title are the stat boxes for that question.
            The <span class="red">red box</span> displays the number of people active in that question.
            The <span class="blue">blue box</span> displays the number of time that question has been clipped.
            The <span class="orange">orange box</span> displays the total number of responses that question has received.
          </p>
          <p>
            As mentioned earlier this content is scrollable so make sure to scoll each question until the footer is displayed.
            If inputed, a description is display after the stat boxes
            followed by any media and/or an external link.
            Clicking the category in the footer, will send you to the <b @click="pageNumber = 14">Category View</b>.
          </p>
          <p>
            <i>
              *The content between the stat boxes and the footer are optional and may or many not be visible
              depending on the information the poster decided to add*
            </i>
          </p>
        </div>
      </div>
    </section>
    <section class="poll-view" v-show="pageNumber > 10 && pageNumber < 14">
      <div class="centered area animated fadeIn" v-show="pageNumber === 11">
        <div class="menu-media biggest">
          <img src="../assets/poll-view.png">
        </div>
        <div class="menu-description smaller menu-text">
          <h2 class="mt0">Poll view</h2>
          <p>
            The poll view is accessed by clicking the title of a question while in the <b @click="pageNumber = 3">Main View</b>,
            clicking on a question in the <b @click="pageNumber = 6">Search Menu</b>, or clicking a question in <b @click="pageNumber = 14">Category View</b>.
            Upon entering the poll view, if you have not entered a response, an input will appear for you to do so.
            Otherwise you will be sent straight to the results.
            This view is made up of two sections, the <b @click="pageNumber = 12">Data Area</b> and the <b @click="pageNumber = 13">Chat Area</b>.
          </p>
        </div>
      </div>
      <div class="centered area animated fadeIn" v-show="pageNumber === 12">
        <div class="menu-media bigger tac">
          <img class="biggest-img"src="../assets/data-area.png">
        </div>
        <div class="menu-description smaller menu-text-short">
          <h3>Data Area</h3>
          <p>
            The data area displays the question, the top responses, a clip button, and the questions stats.
            The top five most frequent responses based out of the total responses are displayed.
            The percent represents the number of times that responses has been inputed out of the total number of responses.
            Under the responses is a clip button.
            Clicking this will add that question to you list of clips, accessable through the <b @click="pageNumber = 8">Clip Menu</b>.
          </p>
        </div>
      </div>
      <div class="centered area animated fadeIn" v-show="pageNumber === 13">
        <div class="menu-media bigger tac">
          <img class="biggest-img" src="../assets/chat-area.png">
        </div>
        <div class="menu-description smaller menu-text-short">
          <h3>Chat Area</h3>
          <p>
            The chat area works like most chat interfaces do, so it should feel quite familiar.
            You can input your message where the 'Any thoughts' text is displayed.
            Your message is sent by clicking your devices enter or equivalent key,
            or by clicking the paper plane icon.
            Message appear in the open area above the input box with your messages appearing on the right
            and everyone else's on the left.
            Note that depending on your current device the chat area may be hidden.
            Click the chat icon on the right to reveal the chat area and once again to hide it.
          </p>
        </div>
      </div>
    </section>
    <section class="category-view" v-show="pageNumber === 14">
      <div class="centered area animated fadeIn">
        <div class="menu-media biggest">
          <img src="../assets/category-view.png">
        </div>
        <div class="menu-description smaller menu-text">
          <h2 class="mt0">Category view</h2>
          <p>
            The category view is accessed by clicking on the category within <b @click="pageNumber = 10">A Question</b> on the <b @click="pageNumber = 3">Main View</b>.
            This view displays all the questions listed under the selected category.
            The category is displayed at the top, followed by the number of questions, a shuffle button,
            and the resulting questions. By default the questions as listed in order of the date added.
            However, clicking the shuffle button randomizes the list for those looking to explore.
            Clicking a question takes you to its <b @click="pageNumber = 11">Poll View</b>.
          </p>
        </div>
      </div>
    </section>
    <section class="clip-view" v-show="pageNumber === 15">
      <div class="centered area animated fadeIn">
        <div class="menu-media biggest">
          <img src="../assets/clip-view.png">
        </div>
        <div class="menu-description smaller menu-text">
          <h2 class="mt0">Clip view</h2>
          <p>
            The clip view is accessed by clicking on a question you have clipped within the <b @click="pageNumber = 8">Clip Menu</b>.
            This view contains an editable notepad allowing you save any additional information about that question.
            The question is displayed at the top next to the show/hide menu button
            and a button linking to the poll page of the question.
            To the left of the notepad is the text editor menu.
            This menu contains buttons that peform text editing actions including bold text, hyperlinks, undo, etc.
            To the right of the note pad, the counts for the notepad are displayed.
            Under the notepad is a save button and a clear button which clears the notepad.
          </p>
        </div>
      </div>
    </section>
    <section class="info-view" v-show="pageNumber === 16">
      <div class="centered area animated fadeIn">
        <div class="menu-media biggest">
          <img src="../assets/info-view.png">
        </div>
        <div class="menu-description smaller menu-text">
          <h2>Info View</h2>
          <p>
            The Info View is accessed by clicking the cog icon at the bottom right corner of any view.
            Here you can re-enter this tour, visit the source for hypersurface, and find links to the technologies being used on hypersurface.
          </p>
        </div>
      </div>
    </section>
    <section class="misc" v-show="pageNumber === 17">
      <div class="centered animated fadeIn">
        <h2 class="mt0 mb2">Some other things you may want to know</h2>
        <ul>
          <li>
            <h3>Hypersurface works offline</h3>
            <p>
              Hypersurface is offline ready. Go ahead and try it yourself.
              However, when using hypersurface offline the real-time updating will no longer happen,
              you will not be able to ask or answer questions, and the chat will be disabled.
              With that said, offline mode does enable access to all the data
              and maintains core functionality such as searching and creating notes all while having no internet connection.
            </p>
          </li>
          <li>
            <h3>Hypersurface is mobile friendly</h3>
            <p>
              The functionality between desktop and mobile is 1 to 1 so feel free to use any device you like.
            </p>
          </li>
          <li>
            <h3>Hypersurface is open source</h3>
            <p>
              The goal for hypersurface is for it to evolve and grow over time.
              I am also open to new ideas and collaboration.
              The source for hypersurface is <a href="https://github.com/aswdesign/hypersurface">here</a>.
            </p>
          </li>
        </ul>
      </div>
    </section>
    <nav>
      <div class="tour-logo">
        <p>hypersurface tour</p>
      </div>
      <div class="ready">
        <button @click="ready()">I'm ready to go</button>
      </div>
    </nav>
    <footer class="tour-footer">
      <div class="next-back">
        <span @click="back()" v-show="pageNumber > 1">back</span>
        <span @click="next()" v-show="pageNumber < 17">next</span>
      </div>
      <div class="page-number">
        <span class="page">{{pageNumber}} / 17</span>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pageNumber: 1
    }
  },
  methods: {
    next () {
      this.pageNumber += 1
    },
    back () {
      this.pageNumber -= 1
    },
    ready () {
      this.$emit('ready')
    }
  }
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 4px;
  height: 2px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  -webkit-border-radius: 5px;
  border-radius: 5px;
}

section {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

section div {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
}

section a {
  color: white;
  font-weight: bold;
  border-bottom: 2px dotted;
  text-decoration: none;
}

section b {
  cursor: pointer;
  border-bottom: 2px solid;
}

section i {
  font-size: .875rem;
}

section p {
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  color: white;
  line-height: 1.4rem;
  margin-top: 0;
}

section h2, section h3, section h4 {
  font-family: 'Lato', sans-serif;
  color: white;
}

section h2 {
  margin-top: 2rem;
  font-size: 3rem;
  margin-bottom: 1rem;
  text-align: left;
}

section h2.mt0 {
  margin-top: 0;
}

section span {
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  color: white;
}

section img {
  width: 100%;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
}

section ul {
  color: white;
}

.red {
  color: #F55737;
  font-weight: bold;
}

.blue {
  color: #36a2eb;
  font-weight: bold;
}

.orange {
  color: #EF9A30;
  font-weight: bold;
}

.centered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.nav-container p {
  margin-bottom: 2rem;
}

.nav-bar-container img  {
  margin-bottom: 2rem;
}

.nav-menu-cell {
  display: table;
  width: 100%;
  box-sizing: border-box;
}

.menu-media, .menu-description {
  display: table-cell;
  box-sizing: border-box;
  vertical-align: middle;
}

.menu-media {
  width: 30%;
}

.bigger {
  width: 40%;
}

.biggest {
  width: 60%;
}

.menu-description {
  width: 70%;
  padding-left: 4rem;
}

.smaller {
  width: 60%;
}

.nav-menu-cell p, .nav-menu-cell h4 {
  text-align: left;
}

.menu-img {
  width: 100%;
  box-sizing: border-box;
}

.area {
  width: 100%;
  box-sizing: border-box;
  padding: 0 10rem;
}

nav {
  position: absolute;
  display: table;
  width: 100%;
  box-sizing: border-box;
  padding: .5rem 3rem;
  font-family: 'Lato', sans-serif;
  color: white;
  background-color: rgb(63, 105, 181);
}

footer {
  color: white;
  font-family: 'Lato', sans-serif;
}

footer span {
  margin-right: 2rem;
  cursor: pointer;
}

footer .page {
  margin-right: 0;
  border-bottom: 2px solid;
}

.tour-footer {
  position: absolute;
  top: 91%;
  background-color: rgb(63, 105, 181);
  z-index: 2;
}

.tour-logo {
  display: table-cell;
  vertical-align: middle;
  font-size: 0.9375rem;
}

.ready {
  display: table-cell;
  vertical-align: middle;
  text-align: right;
  cursor: pointer;
}

.ready button {
  border: 0;
  background-color: rgba(0,171,108, .75);
  padding: .5rem 1.5rem;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.next-back {
  display: table-cell;
  vertical-align: middle;
}

.page-number {
  display: table-cell;
  vertical-align: middle;
  text-align: right;
}

@media screen and (max-width: 1000px) {
  footer {
    padding: .5rem 2rem;
  }

  nav {
    padding: .5rem 2rem;
  }

  section h2, section h3, section h4 {
    text-align: left;
  }

  section h2 {
    font-size: 2rem;
  }

  section img {
    width: 100%;
    margin-bottom: 2rem;
  }

  section ul {
    max-height: 20rem;
    overflow-y: scroll;
  }

  .centered {
    width: 70%;
    text-align: justify;
  }

  .area {
    padding: 0;
  }

  .menu-media,
  .menu-description {
    display: block;
    width: 100%;
  }

  .menu-description {
    padding: 0;
  }

  .menu-text {
    max-height: 16rem;
    overflow-y: scroll;
  }

  .menu-text-short {
    max-height: 13rem;
    overflow-y: scroll;
  }

  .menu-img {
    width: 25%;
    margin-bottom: 2rem;
  }

  .big-img {
    width: 50%;
    margin-bottom: 2rem;
  }

  .biggest-img {
    width: 70%;
    margin-bottom: 2rem;
  }

  .nav-menu-cell {
    text-align: center;
    overflow-y: scroll;
  }

  .nav-menu-cell p {
    text-align: justify;
  }

  .tac {
    text-align: center;
  }

  .mb2 {
    margin-bottom: 2rem;
  }
}

@media screen and (min-height: 1000px) {
  .menu-text,
  .menu-text-short,
  section ul {
    max-height: 30rem;
    overflow: auto;
  }
}

@media screen and (max-width: 1030px) and (min-height: 1300px){
  footer {
    padding: .5rem 2rem;
  }

  nav {
    padding: .5rem 2rem;
  }

  section h2, section h3, section h4 {
    text-align: left;
  }

  section h2 {
    font-size: 2rem;
  }

  section img {
    width: 100%;
    margin-bottom: 2rem;
  }

  section ul {
    max-height: 20rem;
    overflow-y: scroll;
  }

  .centered {
    width: 70%;
    text-align: justify;
  }

  .area {
    padding: 0;
  }

  .menu-media,
  .menu-description {
    display: block;
    width: 100%;
  }

  .menu-description {
    padding: 0;
  }

  .menu-text {
    max-height: 16rem;
    overflow-y: scroll;
  }

  .menu-text-short {
    max-height: 13rem;
    overflow-y: scroll;
  }

  .menu-img {
    width: 25%;
    margin-bottom: 2rem;
  }

  .big-img {
    width: 50%;
    margin-bottom: 2rem;
  }

  .biggest-img {
    width: 70%;
    margin-bottom: 2rem;
  }

  .nav-menu-cell {
    text-align: center;
    overflow-y: scroll;
  }

  .nav-menu-cell p {
    text-align: justify;
  }

  .tac {
    text-align: center;
  }

  .mb2 {
    margin-bottom: 2rem;
  }
}

@media screen and (min-width: 700px) and (max-height: 600px){
  .menu-media {
    width: 70%;
    margin-right: auto;
    margin-left: auto;
  }

  .menu-img {
    width: 20%;
  }

  .big-img {
    width: 40%;
  }

  .biggest-img {
    width: 50%;
  }

  .menu-text {
    max-height: 12rem;
    overflow-y: scroll;
  }
}

@media screen and (min-height: 1000px) {
  .menu-text,
  .menu-text-short,
  section ul {
    max-height: 30rem;
    overflow: auto;
  }
}

@media screen and (min-height: 1300px) {
  .tour-footer {
    position: absolute;
    top: 94%;
  }
}
</style>
