var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm';
import User from './user.js';
export default class Address extends BaseModel {
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], Address.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Address.prototype, "userId", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Address.prototype, "addressLine1", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Address.prototype, "addressLine2", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Address.prototype, "city", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Address.prototype, "districtId", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Address.prototype, "stateId", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Address.prototype, "pincode", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Address.prototype, "phone", void 0);
__decorate([
    belongsTo(() => User),
    __metadata("design:type", Object)
], Address.prototype, "user", void 0);
//# sourceMappingURL=addresss.js.map