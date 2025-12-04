const ChatController = () => import('#controllers/chat_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

// Chat routes - all require authentication
router
  .group(() => {
    router.get('/chat', [ChatController, 'index'])
    router.get('/chat/messages/room', [ChatController, 'getRoomMessages'])
    router.get('/chat/messages/private', [ChatController, 'getPrivateMessages'])
    router.get('/chat/users', [ChatController, 'getUsers'])
    router.get('/chat/unread', [ChatController, 'getUnreadCount'])
    router.get('/chat/search', [ChatController, 'searchMessages'])
    router.delete('/chat/messages/:id', [ChatController, 'deleteMessage'])
  })
  .use(middleware.auth())
