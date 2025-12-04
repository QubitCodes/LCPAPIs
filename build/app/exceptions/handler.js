import app from '@adonisjs/core/services/app';
import { ExceptionHandler } from '@adonisjs/core/http';
export default class HttpExceptionHandler extends ExceptionHandler {
    /**
     * In debug mode, the exception handler will display verbose errors
     * with pretty printed stack traces.
     */
    debug = !app.inProduction;
    /**
     * The method is used for handling errors and returning
     * response to the client
     */
    async handle(error, ctx) {
        return super.handle(error, ctx);
    }
    /**
     * The method is used to report error to the logging service or
     * the third party error monitoring service.
     *
     * @note You should not attempt to send a response from this method.
     */
    async report(error, ctx) {
        return super.report(error, ctx);
    }
}
//# sourceMappingURL=handler.js.map