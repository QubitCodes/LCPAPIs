var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// app/models/otp.ts
import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';
export default class Otp extends BaseModel {
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], Otp.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Otp.prototype, "email", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Otp.prototype, "otp", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Otp.prototype, "purpose", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], Otp.prototype, "isUsed", void 0);
__decorate([
    column.dateTime(),
    __metadata("design:type", DateTime)
], Otp.prototype, "expiresAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], Otp.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], Otp.prototype, "updatedAt", void 0);
//# sourceMappingURL=otp.js.map