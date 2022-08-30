'use strict'

import { bugService } from '../services/bug-service.js'
import { eventBus } from '../services/eventBus-service.js'

export default {
  template: `
    <section v-if="bug" class="bug-details">
        <h1>{{bug.title}}</h1>
        <span :class='"severity" + bug.severity'>Severity: {{bug.severity}}</span>
        <span :class='"severity" + bug.severity'>Description: {{bug.description}}</span>
        <span :class='"severity" + bug.severity'>Creator: {{bug.creator_id}}</span>

        <router-link to="/bug">Back</router-link>
    </section>
    `,
  data() {
    return {
      bug: null,
    }
  },
  created() {
    const { bugId } = this.$route.params
    if (bugId) {
      bugService.getById(bugId)
        .then((bug) => {
          this.bug = bug
        })
        .catch((err) => {
          if (err.response.status === 401) {
            eventBus.emit('show-msg', { txt: 'You have reached maximum bugs per free user, please upgrade or wait some time', type: 'error' })
            this.$router.push('/bug')
          }
        })
    }
  },
}
