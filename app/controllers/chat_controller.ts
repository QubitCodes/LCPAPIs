import Message from '#models/message'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class ChatController {
  // Render chat page
  async index({ view, auth }: HttpContext) {
    return view.render('chat/index', {
      user: auth.user,
    })
  }

  // Get room messages
  /**
   * @getRoomMessages
   * @tag Chat
   * @summary Get room messages
   * @description Retrieves messages for a specific room.
   * @paramQuery room - Room name (default: general)
   * @paramQuery limit - Number of messages to retrieve (default: 50) - @type(number)
   * @paramQuery before - Timestamp to fetch messages before
   * @responseBody 200 - [{"id": 1, "content": "Hello", "user": {"id": 1, "email": "user@example.com"}}]
   */
  async getRoomMessages({ request, response }: HttpContext) {
    const room = request.input('room', 'general')
    const limit = request.input('limit', 50)
    const before = request.input('before')

    let query = Message.query()
      .where('room', room)
      .where('is_private', false)
      .preload('user')
      .orderBy('created_at', 'desc')
      .limit(limit)

    if (before) {
      query = query.where('created_at', '<', before)
    }

    const messages = await query

    return response.json(messages.reverse())
  }

  // Get private messages
  /**
   * @getPrivateMessages
   * @tag Chat
   * @summary Get private messages
   * @description Retrieves private messages between the authenticated user and a recipient.
   * @paramQuery recipientId - ID of the recipient - @required - @type(number)
   * @paramQuery limit - Number of messages to retrieve (default: 50) - @type(number)
   * @responseBody 200 - [{"id": 1, "content": "Hello", "is_private": true}]
   */
  async getPrivateMessages({ request, response, auth }: HttpContext) {
    const recipientId = request.input('recipientId')
    const limit = request.input('limit', 50)
    const user = auth.user as User
    const messages = await Message.query()
      .where('is_private', true)
      .where((query) => {
        query
          .where((subQuery) => {
            subQuery.where('user_id', user.id).where('recipient_id', recipientId)
          })
          .orWhere((subQuery) => {
            subQuery.where('user_id', recipientId).where('recipient_id', user.id)
          })
      })
      .preload('user')
      .preload('recipient')
      .orderBy('created_at', 'asc')
      .limit(limit)

    return response.json(messages)
  }

  // Get all users for chat
  /**
   * @getUsers
   * @tag Chat
   * @summary Get chat users
   * @description Retrieves a list of users available for chat (excluding the authenticated user).
   * @responseBody 200 - [{"id": 1, "email": "user@example.com"}]
   */
  async getUsers({ response, auth }: HttpContext) {
    const user = auth.user as User
    const users = await User.query().whereNot('id', user!.id).select('id', 'email', 'created_at')

    return response.json(users)
  }
  // Get unread message count
  /**
   * @getUnreadCount
   * @tag Chat
   * @summary Get unread message count
   * @description Retrieves the total count of unread messages for the authenticated user.
   * @responseBody 200 - {"unread": 5}
   */
  async getUnreadCount({ response, auth }: HttpContext) {
    const user = auth.user as User
    const count = await Message.query()
      .where('recipient_id', user.id)
      .where('is_read', false)
      .count('* as total')

    return response.json({ unread: count[0].$extras.total })
  }

  // Search messages
  /**
   * @searchMessages
   * @tag Chat
   * @summary Search messages
   * @description Searches for messages based on content.
   * @paramQuery query - Search query - @required
   * @paramQuery room - Room name to search in (optional)
   * @responseBody 200 - [{"id": 1, "content": "Hello world"}]
   */
  async searchMessages({ request, response, auth }: HttpContext) {
    const user = auth.user as User
    const query = request.input('query')
    const room = request.input('room')

    let searchQuery = Message.query().where('content', 'ILIKE', `%${query}%`).preload('user')

    if (room) {
      searchQuery = searchQuery.where('room', room)
    } else {
      // Search in private messages too
      searchQuery = searchQuery.where((subQuery) => {
        subQuery.where('user_id', user.id).orWhere('recipient_id', user.id)
      })
    }

    const messages = await searchQuery.orderBy('created_at', 'desc').limit(20)

    return response.json(messages)
  }

  // Delete message
  /**
   * @deleteMessage
   * @tag Chat
   * @summary Delete a message
   * @description Deletes a specific message. Only the owner can delete their message.
   * @paramPath id - Message ID - @required
   * @responseBody 200 - {"success": true}
   * @responseBody 401 - {"message": "Unauthorized"}
   */
  async deleteMessage({ params, response, auth }: HttpContext) {
    const user = auth.user as User
    const message = await Message.findOrFail(params.id)

    // Only owner can delete
    if (message.userId !== user.id) {
      return response.unauthorized({ message: 'Unauthorized' })
    }

    await message.delete()

    return response.json({ success: true })
  }
}
