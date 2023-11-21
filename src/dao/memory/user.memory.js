export default class user {
  constructor() {
    this.data = [];
  }
  get = async () => {
    return this.data;
  };
  create = async (user) => {
    user._id = this.data.length + 1;
    this.data.push(user);
    return user;
  };
  modify = async (id, user) => {
    const index = this.data.findIndex((value = value._id === id));
    if (index === -1) {
      return null;
    } else {
      this.data[index] = user;
      return user;
    }
  };
  delete = async (id) => {
    const index = this.data.findIndex((value = value._id === +id));
    if (index === -1) {
      return null;
    } else {
      let user = this.data[index];
      this.data.splice(index, 1);
      return user;
    }
  };
}
