import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest.agent("http://localhost:8080");

describe("testing de los usuarios", () => {
  it("deberia crear un usuario", async () => {
    const userMock = {
      username: "usuario1",
      password: "1234",
      email: "usuario1@gmail.com",
    };
    const { statusCode, ok, _body } = await requester
      .post("/api/users/signup")
      .send(userMock);
  });
  it("deberia Iniciar Sesion", async () => {
    const userMock = {
      username: "usuario1",
      password: "1234",
    };
    const { statusCode, ok, _body } = await requester
      .post("/api/users/login")
      .send(userMock);
  });
});
