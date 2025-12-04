import District from '#models/disctricts';
import State from '#models/state';
import { Resp } from '#utils/response_handler';
export default class PlaceController {
    /**
     * @getStatesWithDistricts
     * @tag Places
     * @summary Get all states with districts
     * @description Retrieves all states along with their associated districts.
     * @responseBody 200 - {"message": "Success", "data": [{"id": 1, "name": "State", "districts": [{"id": 1, "name": "District"}]}]}
     */
    async getStatesWithDistricts({ response }) {
        try {
            const states = await State.query().preload('districts');
            return Resp.Api({ response, data: states });
        }
        catch (error) {
            return Resp.InvalidRequest({ message: error.message, response });
        }
    }
    /**
     * @getAllStates
     * @tag Places
     * @summary Get all states
     * @description Retrieves a list of all states.
     * @responseBody 200 - {"message": "Success", "data": [{"id": 1, "name": "State"}]}
     */
    async getAllStates({ response }) {
        try {
            const states = await State.query().select('id', 'name');
            return Resp.Api({ response, data: states });
        }
        catch (error) {
            return Resp.InvalidRequest({ message: error.message, response });
        }
    }
    async getAllDistrictsByIdExample({ request, response }) {
        try {
            const districts = await District.query()
                .join('states', 'states.id', '=', 'districts.state_id')
                .select('states.name as state_name', 'districts.name as district_name')
                .where('districts.state_id', request.input('stateId'))
                .pojo();
            return Resp.Api({ response, data: districts });
        }
        catch (error) {
            return Resp.InvalidRequest({ message: error.message, response });
        }
    }
    /**
     * @getAllDistrictsById
     * @tag Places
     * @summary Get districts by state ID
     * @description Retrieves all districts for a given state ID.
     * @paramQuery stateId - State ID - @required
     * @responseBody 200 - {"message": "Success", "data": [{"id": 1, "name": "District"}]}
     */
    async getAllDistrictsById({ request, response }) {
        try {
            const districts = await District.query()
                .where('state_id', request.input('stateId'))
                .select('id', 'name');
            return Resp.Api({ response, data: districts });
        }
        catch (error) {
            return Resp.InvalidRequest({ message: error.message, response });
        }
    }
}
//# sourceMappingURL=state_controller.js.map