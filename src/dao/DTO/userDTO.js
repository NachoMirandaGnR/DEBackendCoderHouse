export default class UserDTO {
  constructor(user) {
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
    this.age = user.age;
  }
}
