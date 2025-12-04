import { Resp, RespCodes } from '#utils/response_handler';
export default class RoleBasedAccessMiddleware {
    async handle({ auth, response }, next, options) {
        const authenticatedUser = auth.user;
        // Authorization check based on the role_type.
        if (!options.roles.includes(authenticatedUser.role_type)) {
            return Resp.BadApi({
                response,
                message: 'You are not authorized to perform this action.',
                code: RespCodes.AUTHORIZATION_ERROR,
                rc: 403,
            });
        }
        await next();
    }
}
//# sourceMappingURL=role_based_access_middleware.js.map