jest.mock("bcryptjs");

import bcrypt from "bcryptjs";

import { hashPassword, comparePasswords } from "../password";

describe("hashPassword", () => {
  test("calls bcrypt hash method with correct arguments", () => {
    hashPassword("testPassword");
    expect(bcrypt.hash).toHaveBeenCalledWith("testPassword", 10);
  });
});

describe("comparePasswords", () => {
  test("calls bcrypt compareSync method with correct arguments", () => {
    comparePasswords("testPassword", "userPassword");

    expect(bcrypt.compareSync).toHaveBeenCalledWith(
      "testPassword",
      "userPassword"
    );
  });
});
