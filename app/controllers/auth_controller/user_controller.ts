import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import type { HttpContext } from '@adonisjs/core/http'
import { Resp } from '#utils/response_handler'
import { loginValidator, signupValidator } from '#validators/user_validator'
import { errors } from '@vinejs/vine'

export default class UserController {
  /**
   * @signup
   * @tag User Authentication
   * @summary Register a new user
   * @description Registers a new user and returns an authentication token.
   * @requestBody {"name": "John Doe", "email": "john.doe@example.com", "password": "password", "role_type": 5}
   * @responseBody 200 - {"message": "Signup Success!", "data": { "user": { "id": 1, "name": "John Doe", "email": "john.doe@example.com", "role_type": 5 } }, "misc": { "auth": { "token_type": "bearer", "access_token": "token", "expires_in": "7 days" } }}
   */
  public async signup({ request, response }: HttpContext) {
    try {
      const data = await signupValidator.validate(request.all())

      // Role mapping: 1: Superuser, 2: Admin, 3: Contractor, 4: Worker, 5: User
      const roleType = data.role_type

      if (![1, 2, 3, 4, 5].includes(roleType)) {
        return Resp.InvalidRequest({
          response,
          validator: { errors: [{ field: 'role_type', message: 'Invalid role type provided.' }] },
        })
      }

      const existingUser = await User.query()
        .where('email', data.email)
        .where('role_type', roleType)
        .first()

      if (existingUser) {
        return Resp.InvalidRequest({
          response,
          validator: {
            errors: [{ field: 'email', message: 'Email already exists.' }],
          },
        })
      }

      const user = await User.create({
        name: data.name,
        email: data.email,
        password: data.password,
        role_type: roleType,
      })

      const token = await User.accessTokens.create(user, ['*'], {
        expiresIn: '7 days',
      })

      return Resp.Api({
        response,
        message: 'Signup Success!',
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
            token_type: 'bearer',
            access_token: token.value!.release(),
            expires_in: ' 7 days ',
          },
        },
      })
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return Resp.InvalidRequest({ response, validator: { errors: error.messages } })
      }
      throw error
    }
  }

  /**
   * @login
   * @tag User Authentication
   * @summary Login a user
   * @description Authenticates an existing user and returns a new authentication token.
   * @requestBody {"email": "john.doe@example.com", "password": "password", "role_type": 5}
   * @responseBody 200 - {"message": "Login Success!", "data": { "user": { "id": 1, "name": "John Doe", "email": "john.doe@example.com", "role_type": 5 } }, "misc": { "auth": { "token_type": "bearer", "access_token": "token", "expires_in": "7 days" } }}
   */
  public async login({ request, response }: HttpContext) {
    try {
      const data = await loginValidator.validate(request.all())

      const user = await User.query()
        .where('email', data.email)
        .where('role_type', data.role_type)
        .first()
      if (!user) {
        return Resp.InvalidRequest({
          response,
          validator: { errors: [{ message: 'Invalid credentials for the selected role.' }] },
        })
      }

      const isValid = await hash.verify(user.password, data.password)
      if (!isValid) {
        return Resp.InvalidRequest({
          response,
          validator: { errors: [{ message: 'Invalid credentials for the selected role.' }] },
        })
      }

      const token = await User.accessTokens.create(user, ['*'], {
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
            token_type: 'bearer',
            access_token: token.value!.release(),
            expires_in: ' 7 days ',
          },
        },
      })
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return Resp.InvalidRequest({ response, validator: { errors: error.messages } })
      }
      // Re-throw other errors to be handled by the global exception handler
      throw error
    }
  }

  public async getallusers({ auth, response }: HttpContext) {
    const user = auth.user as User

    const id = user.serialize().id
    console.log(id)

    await auth.authenticate()
    const users = await User.all()
    return Resp.Api({ response, data: users })
  }
}

