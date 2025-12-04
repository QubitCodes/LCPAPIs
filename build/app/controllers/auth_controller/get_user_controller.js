import District from '#models/disctricts';
import State from '#models/state';
import User from '#models/user';
import { Resp } from '#utils/response_handler';
export default class GetUserController {
    /**
     * @getUserByRole
     * @tag Get All Users
     * @summary Get users by role
     * @description Retrieve users based on their role type with pagination and search.
     * @paramQuery roleType - Role type to filter users (1: Superuser, 2: Admin, 3: Contractor, 4: Worker, 5: User) - @required
     * @paramQuery page - Page number - @type(number)
     * @paramQuery limit - Number of items per page - @type(number)
     * @paramQuery searchValue - Search by name or email
     * @responseBody 200 - {"message": "Success", "data": [{"id": 1, "name": "John Doe", "email": "john.doe@example.com", "addresses": []}], "misc": {"total": 10, "per_page": 10, "current_page": 1, "last_page": 1}}
     */
    async getUserByRole({ request, response }) {
        try {
            const { roleType, page = 1, limit = 10, searchValue } = request.qs();
            console.log(roleType);
            if (!roleType) {
                return Resp.InvalidRequest({
                    response,
                    validator: { errors: [{ field: 'roleType', message: 'Role type is required' }] },
                });
            }
            const query = User.query()
                .where('role_type', Number(roleType))
                .where('is_active', true)
                .preload('addresses')
                .select('id', 'name', 'email');
            if (searchValue) {
                query.where((builder) => {
                    builder.whereILike('name', `%${searchValue}%`).orWhereILike('email', `%${searchValue}%`);
                });
            }
            const paginator = await query.paginate(Number(page), Number(limit));
            const { data, meta } = paginator.serialize();
            if (!data.length) {
                return Resp.Api({
                    response,
                    data: [],
                    message: 'No users found for the specified role.',
                });
            }
            const states = await State.all();
            const districts = await District.all();
            const rows = data.map((user) => {
                // 'addresses' will be an array because it's a hasMany relationship
                const userAddresses = user.addresses ?? [];
                // Map over the array of addresses to format each one
                const formattedAddresses = userAddresses.map((addr) => {
                    const state = states.find((s) => s.id === addr.stateId);
                    const district = districts.find((d) => d.id === addr.districtId);
                    return {
                        id: addr.id,
                        addressLine1: addr.addressLine1,
                        city: addr.city,
                        pincode: addr.pincode,
                        phone: addr.phone,
                        state: state?.name ?? null,
                        district: district?.name ?? null,
                    };
                });
                return {
                    ...user,
                    // Replace the original addresses array with the newly formatted one
                    addresses: formattedAddresses,
                };
            });
            return Resp.Api({
                response,
                data: rows,
                code: 200,
                message: 'Success',
                misc: meta,
            });
        }
        catch (error) {
            console.log(error);
            return Resp.BadApi({
                response,
                message: 'An unexpected error occurred.',
            });
        }
    }
}
//# sourceMappingURL=get_user_controller.js.map