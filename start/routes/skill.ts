import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const SkillsController = () => import('#controllers/skill_controller/skill_controller')

router
  .group(() => {
    router.get('/', [SkillsController, 'index'])
  })
  .prefix('/api/doc/skills')

router
  .group(() => {
    router.post('/', [SkillsController, 'store'])
    router.post('/attach', [SkillsController, 'attach'])
    router.post('/detach', [SkillsController, 'detach'])
    router.get('/user', [SkillsController, 'show'])
  })
  .prefix('/api/doc/skills')
  .use(middleware.auth())
