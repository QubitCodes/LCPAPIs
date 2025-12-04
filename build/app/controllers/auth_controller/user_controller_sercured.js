import User from '#models/user';
import { Messages, Resp, RespCodes } from '#utils/response_handler';
import { signupValidator } from '#validators/user_validator';
import { errors } from '@vinejs/vine';
export default class UserController {
    /**
     * @createUser
     * @tag User Management
     * @summary Create a new user (Admin/Superuser only)
     * @description Allows Superuser/Admin to create a new Contractor or Worker.
     * @requestBody {"name": "John Doe", "email": "john.doe@example.com", "password": "password", "role_type": 3}
     * @responseBody 201 - {"message": "Record added successfully", "code": "CREATED", "rc": 201, "data": { "user": { "id": 1, "name": "John Doe", "email": "john.doe@example.com", "role_type": 3, "is_active": true } }}
     */
    async createUser({ request, response, auth }) {
        try {
            const authenticatedUser = auth.user;
            // 1. Authorization: Only Superuser (1) and Admin (2) can create users.
            if (![1, 2].includes(authenticatedUser.role_type)) {
                return Resp.BadApi({
                    response,
                    message: 'You are not authorized to perform this action.',
                    code: RespCodes.AUTHORIZATION_ERROR,
                    rc: 403,
                });
            }
            const data = await signupValidator.validate(request.all());
            // 2. Role Validation: Ensure only Contractors (3) or Workers (4) can be created.
            const roleType = data.role_type;
            // if (![3, 4].includes(roleType)) {
            //   return Resp.BadApi({
            //     response,
            //     message: 'Invalid role type. Only Contractors or Workers can be created.',
            //     code: RespCodes.INVALID_INPUT_DATA,
            //     rc: 422,
            //   })
            // }
            // 3. Check for existing user
            const existingUser = await User.query()
                .where('email', data.email)
                .where('role_type', roleType)
                .first();
            if (existingUser) {
                return Resp.BadApi({
                    response,
                    message: 'A user with this email already exists.',
                    code: RespCodes.RESOURCE_ALREADY_EXISTS,
                    rc: 409,
                });
            }
            // 4. Create user
            const user = await User.create({
                name: data.name,
                email: data.email,
                password: data.password,
                role_type: roleType,
                is_active: true, // Set user as active by default
            });
            // 5. Return success response
            return Resp.Api({
                response,
                message: Messages.MESSAGE_ADDED,
                code: RespCodes.CREATED,
                rc: 201,
                data: {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role_type: user.role_type,
                        is_active: user.is_active,
                    },
                },
            });
        }
        catch (error) {
            if (error instanceof errors.E_VALIDATION_ERROR) {
                // Use the custom response handler for validation errors
                return Resp.InvalidRequest({ response, validator: { errors: error.messages } });
            }
            // General server error
            console.error(error); // It's good practice to log the actual error
            return Resp.BadApi({ response, message: 'An unexpected error occurred.' });
        }
    }
    /**
     * @deleteUser
     * @tag User Management
     * @summary Delete a user (Soft delete)
     * @description Soft deletes a user by setting `is_active` to false.
     * @paramPath id - User ID to delete - @required
     * @responseBody 200 - {"message": "Record deleted successfully"}
     */
    async deleteUser({ response, auth, params }) {
        try {
            const authenticatedUser = auth.user;
            // 1. Authorization: Only Superuser (1) and Admin (2) can delete users.
            if (![1, 2].includes(authenticatedUser.role_type)) {
                return Resp.BadApi({
                    response,
                    message: 'You are not authorized to perform this action.',
                    code: RespCodes.AUTHORIZATION_ERROR,
                    rc: 403,
                });
            }
            const userToDelete = await User.find(params.id);
            // 2. Check if user exists
            if (!userToDelete) {
                return Resp.BadApi({
                    response,
                    message: Messages.MESSAGE_NO_RECORDS_SINGLE,
                    code: RespCodes.RESOURCE_NOT_FOUND,
                    rc: 404,
                });
            }
            // 3. Perform soft delete
            userToDelete.is_active = false;
            await userToDelete.save();
            // 4. Return success response
            return Resp.Api({
                response,
                message: Messages.MESSAGE_DELETED,
            });
        }
        catch (error) {
            console.error(error);
            return Resp.BadApi({
                response,
                message: 'An unexpected error occurred while deleting the user.',
            });
        }
    }
}
//# sourceMappingURL=user_controller_sercured.js.map