import { userService } from "../services/user.services.js";
import userPreview from "./user-preview.cmp.js";

export default {
    template: `
        <section>
            <h1>App users</h1>
            <ol>
                <li v-for="(user,idx) in users" :key="idx">
                    <user-preview :user="user" @removeUser="removeUser" />
                </li>
            </ol>
        </section>
 `,
    components: {
        userPreview
    },
    data() {
        return {
            users: null
        };
    },
    methods: {
        removeUser(userId) {
            const idx = this.users.findIndex(user => user._id === userId)
            if (confirm('are you sure?')) {
                userService.removeUser(userId)
                    .then(res => {
                        this.users.splice(idx, 1)
                        console.log(res)
                        console.log('user deleted successfully');
                        this.loadUsers()
                    })
                    .catch(err => console.error('cant remove user' + err))
            }
        },
        loadUsers() {
            userService.query()
                .then(users => this.users = users)
        }
    },
    computed: {},
    created() {
        this.loadUsers()
    },
    unmounted() { },
};