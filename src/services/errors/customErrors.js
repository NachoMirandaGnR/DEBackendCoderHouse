export default class CustomError {
  static createError({ name = "Error", cause, message, code = 1 }) {
    const error = new Error(message, { cause });
    error.name = name;
    error.code = code;
    throw error;
  }
}
export const generateUserErrorInfo = (user) => {
  return `una o mas propiedades del usuario ${user} son invalidas
        list of required properties:
        username: needs to be a string, recived ${user.username}
        email: needs to be a string, recived ${user.email}
        
        `;
};
export const enumErrors = {
  ROUTING_ERROR: 1,
  INVALID_TYPE_ERROR: 2,
  DATABASE_ERROR: 3,
  AUTHENTICATION_ERROR: 4,
  AUTHORIZATION_ERROR: 5,
  VALIDATION_ERROR: 6,
  NOT_FOUND_ERROR: 7,
  UNKNOWN_ERROR: 8,
  DUPLICATE_KEY_ERROR: 9,
};
