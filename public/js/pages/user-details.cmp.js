import { bugService } from "../services/bug-service.js";
import { userService } from "../services/user.services.js"
import bugList from "../cmps/bug-list.cmp.js";
import userList from "../cmps/user-list.cmp.js";


export default {
    template: `
        <section v-if="bugs">
            <button @click="logout">Logout</button>
            <div style="display:flex; justify-content:space-between;">
                <div >
                    <h1>User Profile</h1>
                    <h3>Welcome back : {{user.username}}</h3>
                    <button v-if="user.isAdmin">Admin log</button>
                    <router-link to="/bug">Go to bug list</router-link>
                </div>
                <user-list v-if="user.isAdmin" />
            </div>
            <h4>Your bugs:</h4>
            <bug-list :bugs="bugs" @removeBug="removeBug"/>
            
        </section>
 `,
    components: {
        bugList,
        userList
    },
    data() {
        return {
            user: null,
            bugs: null,
        };
    },
    methods: {
        logout() {
            userService.logout()
                .then(() => {
                    this.user = null
                })
                .catch(err => {
                    console.error('Cannot logout', err)
                })
            this.$router.push('/login-signup')
        },

        removeBug(bugId) {
            console.log(bugId);
            bugService.remove(bugId).then(() => this.loadBugs())
        },

        loadBugs() {
            bugService.query()
                .then(bugs => {
                    console.log(bugs);
                    bugs = bugs.filter(bug => bug.creator_id === this.user._id)
                    this.bugs = bugs
                })
        }
    },
    computed: {},
    created() {
        this.user = userService.getLoggedInUser()
        console.log(this.user);
        if (!this.user) {
            console.log('Please login first');
            this.$router.push('/login-signup')
            return
        }
        this.loadBugs()
    },
    mounted() {

    },
    unmounted() { },
};