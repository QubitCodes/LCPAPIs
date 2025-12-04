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
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm';
import User from '#models/user'; // Assuming you have a User model
import State from '#models/state';
import District from '#models/disctricts';
export default class Address extends BaseModel {
    static table = 'addresses'; // Explicitly define the table name
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], Address.prototype, "id", void 0);
__decorate([
    column({ columnName: 'user_id' }) // Map to user_id in the database
    ,
    __metadata("design:type", Number)
], Address.prototype, "userId", void 0);
__decorate([
    column({ columnName: 'address_line_1' }),
    __metadata("design:type", String)
], Address.prototype, "addressLine1", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Address.prototype, "city", void 0);
__decorate([
    column({ columnName: 'district_id' }),
    __metadata("design:type", Object)
], Address.prototype, "districtId", void 0);
__decorate([
    column({ columnName: 'state_id' }),
    __metadata("design:type", Object)
], Address.prototype, "stateId", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Address.prototype, "pincode", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Address.prototype, "phone", void 0);
__decorate([
    column({ columnName: 'is_active' }),
    __metadata("design:type", Boolean)
], Address.prototype, "isActive", void 0);
__decorate([
    column({ columnName: 'created_by' }),
    __metadata("design:type", Object)
], Address.prototype, "createdBy", void 0);
__decorate([
    column({ columnName: 'updated_by' }),
    __metadata("design:type", Object)
], Address.prototype, "updatedBy", void 0);
__decorate([
    column({ columnName: 'deleted_by' }),
    __metadata("design:type", Object)
], Address.prototype, "deletedBy", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], Address.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], Address.prototype, "updatedAt", void 0);
__decorate([
    column.dateTime({ columnName: 'deleted_at' }),
    __metadata("design:type", Object)
], Address.prototype, "deletedAt", void 0);
__decorate([
    belongsTo(() => User, {
        foreignKey: 'userId',
        localKey: 'id',
    }),
    __metadata("design:type", Object)
], Address.prototype, "user", void 0);
__decorate([
    belongsTo(() => State, {
        foreignKey: 'stateId',
        localKey: 'id',
    }),
    __metadata("design:type", Object)
], Address.prototype, "state", void 0);
__decorate([
    belongsTo(() => District, {
        foreignKey: 'districtId',
        localKey: 'id',
    }),
    __metadata("design:type", Object)
], Address.prototype, "district", void 0);
//# sourceMappingURL=Address.js.map