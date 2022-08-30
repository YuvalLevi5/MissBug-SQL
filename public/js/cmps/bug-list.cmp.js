'use strict'

import { userService } from "../services/user.services.js"
import bugPreview from './bug-preview.cmp.js'

export default {
  props: ['bugs'],
  template: `
    <section v-if="bugs.length" className="bug-list">                    
      <bug-preview v-for="bug in bugs" :bug="bug" :key="bug._id" @removeBug="$emit('removeBug', $event)" />
    </section>
    <section v-else class="bug-list">Yay! No Bugs!</section>
    `, 
    
    created(){
      this.user = userService.getLoggedInUser()
      if(!this.user) this.$router.push('/login-signup')
    },
  methods: {},
  components: {
    bugPreview,
  },
}
