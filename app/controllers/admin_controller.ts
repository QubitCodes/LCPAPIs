import Address from '#models/Address'
import User from '#models/user'
import { Messages, Resp, RespCodes } from '#utils/response_handler'
import type { HttpContext } from '@adonisjs/core/http'

export default class AdminController {
  /**
   * Get a list of all users.
   * Accessible only by admins/superadmins.
   */
  public async listAllUsers({ request, response }: HttpContext) {
    try {
      const { page = 1, limit = 10, searchValue, roleType } = request.qs()

      const query = User.query().preload('addresses', (addressQuery) => {
        addressQuery.preload('state').preload('district')
      })

      // Apply optional role filter
      if (roleType) {
        query.where('role_type', roleType)
      }

      // Apply optional search filter
      if (searchValue) {
        query.where((builder) => {
          builder
            .where('name', 'like', `%${searchValue}%`)
            .orWhere('email', 'like', `%${searchValue}%`)
        })
      }

      const paginator = await query.paginate(Number(page), Number(limit))

      // Use the paginator's serialize method to get data and metadata
      const result = paginator.serialize()

      return Resp.Api({
        response,
        message: Messages.MESSAGE_FETCHED,
        data: result.data.map((user: any) => ({
          ...user,
          addresses: user.addresses
            ? user.addresses.map((address: any) => this.transformAddress(address))
            : [],
        })),
        misc: { meta: result.meta },
      })
    } catch (error) {
      console.error(error)
      return Resp.BadApi({
        response,
        message: 'An unexpected error occurred while fetching users.',
      })
    }
  }

  /**
   * Get a list of all addresses from all users.
   * Accessible only by admins/superadmins.
   */
  public async listAllAddresses({ request, response }: HttpContext) {
    try {
      const { page = 1, limit = 10, searchValue } = request.qs()

      const query = Address.query().preload('state').preload('district').preload('user')

      // Apply optional search filter on address fields or user name/email
      if (searchValue) {
        query.where((builder) => {
          builder
            .where('address_line_1', 'like', `%${searchValue}%`)
            .orWhere('city', 'like', `%${searchValue}%`)
            .orWhere('pincode', 'like', `%${searchValue}%`)
            .preload('state')
            .preload('district')
            .orWhereHas('user', (userQuery) => {
              userQuery
                .where('name', 'like', `%${searchValue}%`)
                .orWhere('email', 'like', `%${searchValue}%`)
            })
        })
      }

      const paginator = await query.paginate(Number(page), Number(limit))
      const result = paginator.serialize()

      return Resp.Api({
        response,
        message: Messages.MESSAGE_FETCHED,
        data: result.data.map((address: any) => this.transformAddress(address)),
        misc: { meta: result.meta },
      })
    } catch (error) {
      console.error(error)
      return Resp.BadApi({
        response,
        message: 'An unexpected error occurred while fetching addresses.',
      })
    }
  }

  /**
   * Get all addresses for a specific user.
   * Accessible only by admins/superadmins.
   */
  public async listUserAddresses({ response, request }: HttpContext) {
    try {
      const { userId } = request.qs()
      const user = await User.findOrFail(userId)
      const addresses = await Address.query()
        .where('user_id', user.id)
        .where('is_active', true)
        .preload('state')
        .preload('district')

      const data = addresses.map((address) => this.transformAddress(address.serialize()))
      const message = `Addresses for user ${user.name} fetched.`
      return Resp.Api({ response, message, data })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return Resp.BadApi({
          response,
          message: 'The specified user was not found.',
          code: RespCodes.RESOURCE_NOT_FOUND,
          rc: 404,
        })
      }

      console.error(error) // Log other unexpected errors
      return Resp.BadApi({ response, message: 'Failed to fetch addresses for the specified user.' })
    }
  }

  /**
   * Transforms a serialized address object to the desired response format.
   */
  private transformAddress(address: any) {
    const { state, district, ...rest } = address
    return {
      ...rest,
      stateName: state?.name || null,
      districtName: district?.name || null,
    }
  }
}
