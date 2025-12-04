import Skill from '#models/skill';
export default class SkillsController {
    async index({ response }) {
        const skills = await Skill.all();
        return response.ok(skills);
    }
    async store({ request, response }) {
        const { name } = request.only(['name']);
        const skill = await Skill.create({ name });
        return response.created(skill);
    }
    async attach({ request, response, auth }) {
        const user = await auth.authenticate();
        const { skillId } = request.only(['skillId']);
        const skill = await Skill.findOrFail(skillId);
        await user.related('skills').attach([skill.id]);
        return response.ok({ message: 'Skill attached successfully' });
    }
    async detach({ request, response, auth }) {
        const user = await auth.authenticate();
        const { skillId } = request.only(['skillId']);
        await user.related('skills').detach([skillId]);
        return response.ok({ message: 'Skill detached successfully' });
    }
    async show({ response, auth }) {
        const user = await auth.authenticate();
        await user.load('skills');
        return response.ok(user.skills);
    }
}
//# sourceMappingURL=skill_controller.js.map