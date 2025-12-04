import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const UserController = () => import('#controllers/auth_controller/user_controller_sercured')

// =======================================================
// 👤 user_Auth Routes
// =======================================================
// Open EndPoint
router
  .group(() => {
    router.post('/signup', [UserController, 'createUser'])
    router.delete('/delete/:id', [UserController, 'deleteUser'])
  })
  .prefix('/api/doc/auth/secured')
  .use(middleware.auth())
