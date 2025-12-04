// start/socket.ts - Updated with database persistence
import { Server } from 'socket.io'
import server from '@adonisjs/core/services/server'
import app from '@adonisjs/core/services/app'
import Message from '#models/message'
import User from '#models/user'

console.log('🧠 Socket.IO initializing…')

const userSockets = new Map<string, string>()

app.ready(() => {
  const nodeServer = server.getNodeServer()
  const io = new Server(nodeServer, {
    cors: {
      origin:
        process.env.FRONT_END_URL || 'http://localhost:3000' || 'cyber-fort-web-admin.vercel.app', // your frontend URL in dev
      credentials: true,
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
  })

  io.use(async (socket, next) => {
    const userId = socket.handshake.auth.userId || socket.handshake.query.userId
    if (!userId) {
      return next(new Error('Authentication error: userId required'))
    }

    try {
      // Verify user exists in database
      const user = await User.find(userId)
      if (!user) {
        return next(new Error(`User with ID ${userId} does not exist`))
      }

      socket.data.userId = userId
      socket.data.user = user
      next()
    } catch (error) {
      next(new Error('Authentication error: Failed to verify user'))
    }
  })

  io.on('connection', (socket) => {
    const userId = socket.data.userId
    console.log(`✅ User ${userId} connected with socket ${socket.id}`)

    userSockets.set(userId, socket.id)

    socket.emit('online', {
      userId,
      onlineUsers: Array.from(userSockets.keys()),
    })

    socket.broadcast.emit('user:online', { userId })

    // Handle private messages with database persistence
    socket.on(
      'private:message',
      async (data: { to: string; message: string; timestamp?: number; tempId: number }) => {
        const { to, message, tempId } = data
        const from = userId

        try {
          const savedMessage = await Message.create({
            userId: Number(from),
            recipientId: Number(to),
            content: message,
            room: `private_${Math.min(Number(from), Number(to))}_${Math.max(Number(from), Number(to))}`,
            isPrivate: true,
            isRead: false,
          })

          const recipientSocketId = userSockets.get(to)

          if (recipientSocketId) {
            io.to(recipientSocketId).emit('private:message', {
              id: savedMessage.id,
              from,
              message,
              timestamp: savedMessage.createdAt.toMillis(),
            })

            socket.emit('private:message:sent', {
              id: savedMessage.id,
              tempId, // ✅ return same key used by frontend
              to,
              message,
              timestamp: savedMessage.createdAt.toMillis(),
              status: 'delivered',
            })
          } else {
            socket.emit('private:message:sent', {
              id: savedMessage.id,
              tempId, // ✅ keep same
              to,
              message,
              timestamp: savedMessage.createdAt.toMillis(),
              status: 'saved',
            })
          }
        } catch (error) {
          console.error('Error saving message:', error)
          socket.emit('private:message:error', {
            to,
            message,
            error: 'Failed to save message',
            status: 'failed',
          })
        }
      }
    )

    // Handle read receipts with database update
    socket.on('private:read', async (data: { to: string; messageId: number }) => {
      try {
        // Fetch message from DB
        const message = await Message.find(data.messageId)

        if (!message) {
          console.log(`❌ Message ${data.messageId} not found`)
          return
        }

        // Verify that the user reading the message is indeed the recipient
        if (message.recipientId !== Number(userId)) {
          console.log(`🚫 User ${userId} is not the recipient of message ${data.messageId}`)
          return
        }

        // Mark as read in the database
        message.isRead = true
        await message.save()

        // Notify the sender (the original message author)
        const senderSocketId = userSockets.get(String(message.userId))
        if (senderSocketId) {
          io.to(senderSocketId).emit('private:read', {
            from: userId,
            messageId: message.id,
            timestamp: message.updatedAt?.toMillis?.() ?? Date.now(),
          })
        } else {
          console.log(`💤 Sender ${message.userId} is offline, skipping read receipt emit`)
        }

        // Notify the reader (confirmation)
        socket.emit('private:read:confirm', {
          messageId: message.id,
          status: 'read',
          timestamp: message.updatedAt?.toMillis?.() ?? Date.now(),
        })
      } catch (error) {
        console.error('Error updating read status:', error)
        socket.emit('private:read:error', {
          messageId: data.messageId,
          error: 'Failed to update read status',
        })
      }
    })

    socket.on('private:typing', (data: { to: string; isTyping: boolean }) => {
      const recipientSocketId = userSockets.get(data.to)
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('private:typing', {
          from: userId,
          isTyping: data.isTyping,
        })
        console.log(
          `⌨️  User ${userId} is ${data.isTyping ? 'typing' : 'stopped typing'} to ${data.to}`
        )
      } else {
        console.log(`❌ User ${data.to} is offline, cannot send typing indicator`)
      }
    })

    socket.on('disconnect', () => {
      console.log(`❌ User ${userId} disconnected`)
      userSockets.delete(userId)
      socket.broadcast.emit('user:offline', { userId })
    })
  })

  console.log('🚀 Socket.IO successfully attached to Adonis HTTP server')
})
