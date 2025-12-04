var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { DateTime } from 'luxon';
import { BaseModel, column, beforeSave, hasMany, manyToMany } from '@adonisjs/lucid/orm';
import hash from '@adonisjs/core/services/hash';
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens';
import Address from './Address.js';
import Skill from './skill.js';
export default class User extends BaseModel {
    static async hashPassword(user) {
        if (user.$dirty.password) {
            user.password = await hash.make(user.password);
        }
    }
    static accessTokens = DbAccessTokensProvider.forModel(User);
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], User.prototype, "uid", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    column({ serializeAs: null }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], User.prototype, "role_type", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], User.prototype, "first_login", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], User.prototype, "is_email_verified", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], User.prototype, "is_active", void 0);
__decorate([
    hasMany(() => Address, {
        foreignKey: 'userId',
        localKey: 'id',
    }),
    __metadata("design:type", Object)
], User.prototype, "addresses", void 0);
__decorate([
    manyToMany(() => Skill, {
        pivotTable: 'skill_user',
    }),
    __metadata("design:type", Object)
], User.prototype, "skills", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], User.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], User.prototype, "updatedAt", void 0);
__decorate([
    beforeSave(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", Promise)
], User, "hashPassword", null);
//# sourceMappingURL=user.js.map