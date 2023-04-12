module.exports = class UserDto {
    id;
    email;
    role;
    isActive;
    constructor(model) {
        this.id = model.id
        this.email = model.email
        this.role = model.role
        this.isActive = model.isActive
    }
}