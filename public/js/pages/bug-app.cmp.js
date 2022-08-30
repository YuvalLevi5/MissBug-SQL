'use strict'
import { bugService } from '../services/bug-service.js'
import bugList from '../cmps/bug-list.cmp.js'
import bugFilter from '../cmps/bug-filter.cmp.js'


export default {
  template: `
    <section class="bug-app">
        <div class="subheader">
          <bug-filter @setFilterBy="setFilterBy"></bug-filter> ||
          <router-link to="/bug/edit">Add New Bug</router-link> 
        </div>
        <bug-list v-if="bugs" :bugs="bugsToDisplay" @removeBug="removeBug"></bug-list>
        <button @click="onSetPage(-1)">Prev</button>
        <button @click="onSetPage(1)">Next</button>
    </section>
    `,
  data() {
    return {
      bugs: null,
      filterBy: {
        bySeverity: '',
        pageIdx: 0
      },
    }
  },
  created() {
    this.loadBugs()
  },
  methods: {
    loadBugs() {
      bugService.query(this.filterBy)
        .then(bugs => this.bugs = bugs)
    },
    setFilterBy(filterBy) {
      this.filterBy = filterBy
    },
    removeBug(bugId) {
      bugService.remove(bugId).then(() => this.loadBugs())
    },
    onSetPage(dir) {
      this.filterBy.pageIdx += dir;
      if (this.filterBy.pageIdx < 0) this.filterBy.pageIdx = 0;
      if (this.filterBy.pageIdx > this.bugs.length-1 ) this.filterBy.pageIdx = 0;
      this.loadBugs()
    }
  },
  computed: {
    bugsToDisplay() {
      if (!this.filterBy?.title) return this.bugs
      return this.bugs.filter((bug) => bug.title.includes(this.filterBy.title))
    },
  },
  components: {
    bugList,
    bugFilter,
  },
}
