import type { HttpContext } from '@adonisjs/core/http'
import { firebaseAdmin } from '#services/firebase'
import User from '#models/user'
import { Resp } from '#utils/response_handler'

export default class FireBaseAuthController {
  public async firebase({ request, response }: HttpContext) {
    console.log('Received request:')
    try {
      // Extract the token from the Authorization header
      const authHeader = request.header('Authorization')
      const { roleType } = request.all()

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return Resp.InvalidRequest({
          response,
          validator: { errors: [{ field: 'token', message: 'Bearer token is required' }] },
        })
      }

      const token = authHeader.substring(7) // Remove "Bearer " prefix

      if (!roleType) {
        return Resp.InvalidRequest({
          response,
          validator: { errors: [{ field: 'roleType', message: 'Role type is required' }] },
        })
      }
      console.log('Received roleType:', roleType)
      console.log('Received token:', token)
      const decoded = await firebaseAdmin.verifyIdToken(token)
      console.log('Decoded Firebase token:', decoded)
      if (!decoded) {
        return Resp.InvalidRequest({
          response,
          validator: { errors: [{ field: 'token', message: 'Invalid token' }] },
        })
      }
      const user = await User.firstOrCreate(
        { uid: decoded.uid },
        {
          email: decoded.email,
          name: decoded.name ?? '',
          avatar: decoded.picture ?? '',
          role_type: roleType,
          first_login: false,
          is_email_verified: true,
        }
      )
      console.log('User created or found:', user.toJSON())
      const jwt = await User.accessTokens.create(user, ['*'], {
        expiresIn: '7 days',
      })

      return Resp.Api({
        response,
        message: 'Login Success!',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role_type: user.role_type,
          },
        },
        misc: {
          auth: {
            // The token property on the jwt object is what you need
            access_token: jwt.value!.release(),
          },
        },
      })
    } catch (error) {
      console.error('Error during Firebase auth:', error)
      // Provide a more specific error message if possible
      const message = error.code === 'auth/id-token-expired' ? 'Token has expired' : error.message
      return Resp.InvalidRequest({
        response,
        validator: { errors: [{ field: 'token', message }] },
      })
    }
  }
}
