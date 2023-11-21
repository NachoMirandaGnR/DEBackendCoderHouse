export default class product {
  constructor() {
    this.data = [];
  }
  get = async () => {
    return this.data;
  };
  create = async (product) => {
    product._id = this.data.length + 1;
    this.data.push(product);
    return product;
  };
  modify = async (id, product) => {
    const index = this.data.findIndex((value = value._id === id));
    if (index === -1) {
      return null;
    } else {
      this.data[index] = product;
      return;
    }
  };
  delete = async (id) => {
    const index = this.data.findIndex((value = value._id === +id));
    if (index === -1) {
      return null;
    } else {
      let product = this.data[index];
      this.data.splice(index, 1);
      return product;
    }
  };
}
