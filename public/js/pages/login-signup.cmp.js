import { userService } from "../services/user.services.js";

export default {
  template: `
    <section>
        <button @click="action = signup">Signup</button>
        <button @click="action = login">Login</button>
            <section>
                <form v-if="action === signup" @submit.prevent="signup" style="display:flex; flex-direction:column; max-width:50%; margin:auto;">
                    <h3>Signup</h3>
                        <input id="signup-fullname" v-model="signupInfo.fullname" placeholder="Enter full name" type="text">
                        <input id="signup-username" v-model="signupInfo.username" placeholder="Enter username" type="text">
                        <input id="signup-password" v-model="signupInfo.password" placeholder="Enter password" type="password">
                    <button>Signup</button>
                </form>
                <form v-else @submit.prevent="login" style="display:flex; flex-direction:column; max-width:50%; margin:auto;">
                    <h3>Login</h3>
                    <input v-model="credential.username" required id="name" placeholder="Enter user name" type="text">
                    <input v-model="credential.password" required id="password" placeholder="Enter user password" type="password">
                    <button>Login</button>
                </form>  
            </section>
 </section>
 `,
  components: {},
  data() {
    return {
      action: null,
      user: null,
      credential: {
        username: "",
        password: "",
      },
      signupInfo: {
        fullname: "",
        username: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      userService
        .login(this.credential)
        .then((user) => {
          this.user = user;
          this.$router.push("/user-details");
        })
        .catch((err) => {
          console.error("username or password are inccorect");
        });
      this.resetPage();
    },
    signup() {
      userService
        .signup(this.signupInfo)
        .then((user) => {
          this.user = user;
          this.$router.push("/user-details");
        })
        .catch((err) => {
          console.error("Cannot signup", err);
        });
      this.resetPage();
    },
    resetPage() {
      this.credential = {
        username: "",
        password: "",
      };
      this.signupInfo = {
        fullname: "",
        username: "",
        password: "",
      };
    },
  },
  computed: {},
  created() {},
  unmounted() {},
};
