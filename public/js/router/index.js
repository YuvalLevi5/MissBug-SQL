import bugApp from '../pages/bug-app.cmp.js'
import bugEdit from '../pages/bug-edit.cmp.js'
import bugDetails from '../pages/bug-details.cmp.js'

import loginSignup from '../pages/login-signup.cmp.js'
import userDetails from '../pages/user-details.cmp.js'

const routes = [
  { path: '/', redirect: '/login-signup' },
  { path: '/bug', component: bugApp },
  { path: '/bug/edit/:bugId?', component: bugEdit },
  { path: '/bug/:bugId', component: bugDetails },
  { path: '/login-signup', component: loginSignup },
  { path: '/user-details', component: userDetails },
]

export const router = VueRouter.createRouter({ history: VueRouter.createWebHashHistory(), routes })
