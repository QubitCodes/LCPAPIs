/**
 * Updating the "Accept" header to always accept "application/json" response
 * from the server. This will force the internals of the framework like
 * validator errors or auth errors to return a JSON response.
 */
export default class ForceJsonResponseMiddleware {
    async handle({ request }, next) {
        const headers = request.headers();
        headers.accept = 'application/json';
        return next();
    }
}
//# sourceMappingURL=force_json_response_middleware.js.map