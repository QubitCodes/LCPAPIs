import Address from '#models/Address';
import { Messages, Resp, RespCodes } from '#utils/response_handler';
import { DateTime } from 'luxon';
export default class AddressController {
    transform(address) {
        const json = address.serialize();
        if (address.state) {
            json.stateName = address.state.name;
            delete json.state;
        }
        if (address.district) {
            json.districtName = address.district.name;
            delete json.district;
        }
        return json;
    }
    /**
     * @index
     * @tag Address
     * @summary Get all addresses
     * @description Retrieves all active addresses for the authenticated user.
     * @responseBody 200 - {"message": "Addresses fetched successfully", "data": [{"id": 1, "address_line_1": "123 St", "city": "City", "stateName": "State", "districtName": "District"}]}
     */
    async index({ response, auth }) {
        try {
            const user = auth.user;
            const addresses = await Address.query()
                .where('user_id', user.id)
                .where('is_active', true)
                .preload('state')
                .preload('district');
            const data = addresses.map((address) => this.transform(address));
            return Resp.Api({ response, message: Messages.MESSAGE_FETCHED, data });
        }
        catch (error) {
            console.error(error); // Log other errors for debugging
            return Resp.BadApi({ response, message: 'An unexpected error occurred' });
        }
    }
    /**
     * @show
     * @tag Address
     * @summary Get address details
     * @description Retrieves details of a specific address.
     * @paramPath id - Address ID - @required
     * @responseBody 200 - {"message": "Address fetched successfully", "data": {"id": 1, "address_line_1": "123 St", "city": "City", "stateName": "State", "districtName": "District"}}
     * @responseBody 404 - {"message": "Address not found"}
     */
    async show({ response, params, auth }) {
        try {
            const user = auth.user;
            const address = await Address.query()
                .where('id', params.id)
                .where('is_active', true)
                .preload('state')
                .preload('district')
                .firstOrFail();
            if (address.userId !== user.id) {
                return Resp.BadApi({
                    response,
                    message: 'You are not allowed to view this address',
                    code: RespCodes.AUTHORIZATION_ERROR,
                    rc: 403,
                });
            }
            return Resp.Api({
                response,
                message: Messages.MESSAGE_FETCHED_SINGLE,
                data: this.transform(address),
            });
        }
        catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return Resp.BadApi({
                    response,
                    message: 'Address not found',
                    code: RespCodes.RESOURCE_NOT_FOUND,
                    rc: 404,
                });
            }
            console.error(error); // Log other errors for debugging
            return Resp.BadApi({ response, message: 'An unexpected error occurred' });
        }
    }
    /**
     * @upsert
     * @tag Address
     * @summary Create or Update address
     * @description Creates a new address or updates an existing one if ID is provided.
     * @requestBody {"id": 1, "address_line_1": "123 St", "city": "City", "district_id": 1, "state_id": 1, "pincode": "123456", "phone": "1234567890"}
     * @responseBody 200 - {"message": "Address updated successfully", "data": {"id": 1}}
     * @responseBody 201 - {"message": "Address added successfully", "data": {"id": 1}}
     */
    async upsert({ request, response, auth }) {
        const user = auth.user;
        const payload = request.only([
            'id',
            'address_line_1',
            'city',
            'district_id',
            'state_id',
            'pincode',
            'phone',
        ]);
        try {
            // If an ID is provided, it's an update.
            if (payload.id) {
                const address = await Address.findOrFail(payload.id);
                // Authorization check: Ensure the user owns the address.
                if (address.userId !== user.id) {
                    return Resp.BadApi({
                        response,
                        message: 'You are not allowed to update this address.',
                        code: RespCodes.AUTHORIZATION_ERROR,
                        rc: 403,
                    });
                }
                address.merge({
                    ...payload,
                    updatedBy: user.id,
                    isActive: true,
                    deletedBy: null,
                    deletedAt: null,
                });
                await address.save();
                await address.load('state');
                await address.load('district');
                return Resp.Api({
                    response,
                    message: Messages.MESSAGE_UPDATED,
                    data: this.transform(address),
                    rc: 200,
                });
            }
            else {
                // If no ID is provided, it's a create.
                const address = await Address.create({ ...payload, userId: user.id, createdBy: user.id });
                await address.load('state');
                await address.load('district');
                return Resp.Api({
                    response,
                    message: Messages.MESSAGE_ADDED,
                    data: this.transform(address),
                    rc: 201,
                });
            }
        }
        catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return Resp.BadApi({
                    response,
                    message: 'Address not found for update.',
                    code: RespCodes.RESOURCE_NOT_FOUND,
                    rc: 404,
                });
            }
            console.error(error); // Log other errors for debugging
            return Resp.BadApi({ response, message: 'An unexpected error occurred' });
        }
    }
    /**
     * @destroy
     * @tag Address
     * @summary Delete address
     * @description Soft deletes an address.
     * @paramPath id - Address ID - @required
     * @responseBody 200 - {"message": "Address deleted successfully"}
     * @responseBody 404 - {"message": "Address not found"}
     */
    async destroy({ response, auth, params }) {
        try {
            const user = auth.user;
            const address = await Address.findOrFail(params.id);
            // Authorization check: Ensure the user owns the address.
            if (address.userId !== user.id) {
                return Resp.BadApi({
                    response,
                    message: 'You are not allowed to delete this address.',
                    code: RespCodes.AUTHORIZATION_ERROR,
                    rc: 403,
                });
            }
            address.isActive = false;
            address.deletedBy = user.id;
            address.deletedAt = DateTime.now();
            await address.save();
            return Resp.Api({ response, message: Messages.MESSAGE_DELETED, rc: 200 });
        }
        catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return Resp.BadApi({
                    response,
                    message: 'Address not found',
                    code: RespCodes.RESOURCE_NOT_FOUND,
                    rc: 404,
                });
            }
            console.error(error); // Log other errors for debugging
            return Resp.BadApi({ response, message: 'An unexpected error occurred' });
        }
    }
}
//# sourceMappingURL=address_controller.js.map