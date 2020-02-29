import bcrypt from "bcryptjs";

export const hashPassword = password => {
  return bcrypt.hash(password, 10);
};

export const comparePasswords = (test, password) => {
  return bcrypt.compareSync(test, password);
};
