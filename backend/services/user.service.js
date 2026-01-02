import { User } from "../models/user.model.js";

const createUser = async ({ firstname, lastname, email, password }) => {
  if (!firstname || !email || !password) {
    throw new Error("Missing required fields");
  }
  const user = new User.create({
    fullName: {
      firstname,
      lastname,
    },
    email,
    password,
  });
  return user;
};

export { createUser };
