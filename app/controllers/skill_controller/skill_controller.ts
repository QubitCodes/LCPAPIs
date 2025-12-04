import type { HttpContext } from '@adonisjs/core/http'
import Skill from '#models/skill'

export default class SkillsController {
  public async index({ response }: HttpContext) {
    const skills = await Skill.all()
    return response.ok(skills)
  }

  public async store({ request, response }: HttpContext) {
    const { name } = request.only(['name'])
    const skill = await Skill.create({ name })
    return response.created(skill)
  }

  public async attach({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    const { skillId } = request.only(['skillId'])

    const skill = await Skill.findOrFail(skillId)

    await user.related('skills').attach([skill.id])

    return response.ok({ message: 'Skill attached successfully' })
  }

  public async detach({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    const { skillId } = request.only(['skillId'])

    await user.related('skills').detach([skillId])

    return response.ok({ message: 'Skill detached successfully' })
  }

  public async show({ response, auth }: HttpContext) {
    const user = await auth.authenticate()
    await user.load('skills')
    return response.ok(user.skills)
  }
}
