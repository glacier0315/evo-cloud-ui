/** When your routing table is too long, you can split it into small modules **/

// import Layout from '@/layout'

const endRouter = [
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export default endRouter
