import { Resp } from '#utils/response_handler';
/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
    /**
     * The URL to redirect to, when authentication fails
     */
    redirectTo = '/login';
    async handle(ctx, next, options = {}) {
        try {
            await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo });
            return next();
        }
        catch (error) {
            return Resp.NoAuth({ response: ctx.response });
        }
    }
}
//# sourceMappingURL=auth_middleware.js.map