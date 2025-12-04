declare module '@adonisjs/core/http' {
  interface HttpContext {
    view: { render: (template: string, data?: Record<string, any>) => Promise<string> }
  }
}
