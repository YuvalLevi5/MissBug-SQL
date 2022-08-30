export default {
    props: ['user'],
    template: `
        <section v-if="user" style="display:flex; justify-content:space-between;">
            <p>User name: {{user.username}}</p>
            <button @click="removeUser">X</button>
        </section>
    `,
    
    methods: {
        removeUser(){
            this.$emit('removeUser',this.user._id)
        }
    },
};