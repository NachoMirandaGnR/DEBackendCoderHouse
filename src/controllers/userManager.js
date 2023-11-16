import userModel from "../dao/mongo/models/user.models.js";
class productManager {
  constructor() {}
  async getUsers() {
    try {
      const products = await userModel.find().lean();
      return products;
    } catch {
      return [];
    }
  }

  async addUser(user) {
    const newUser = await userModel.create(user);
    return newUser;
  }

  async getUserByCode(code) {
    const productByCode = await userModel.findById(code);
    return productByCode;
  }

  async deleteProduct(code) {
    const productByCode = await userModel.findByIdAndDelete(code);
    return productByCode;
  }
  async updateProdcutByCode(code, modified) {
    const productByCode = await userModel.findByIdAndUpdate(code, modified);
    return productByCode;
  }
}

export default productManager;
