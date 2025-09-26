import { describe, it, expect, vi, afterEach } from "vitest";
import { createUser, MIN_USER_AGE } from "./user.service";
import * as userRepository from "./user.repository";

vi.mock("./user.repository", async () => {
  const actual = await vi.importActual("./user.repository");
  return {
    ...actual,
    createUserInRepository: vi.fn((data) => {
      return {
        id: 4,
        name: data.name,
        birthday: data.birthday,
      };
    }),
  };
});

describe("User Service", () => {
  afterEach(() => vi.clearAllMocks());

  it("should create a user", async () => {
    const input = {
      name: "Valentin R",
      birthday: new Date(1997, 8, 13), // ← aligne avec les attentes ci-dessous
    };

    const user = await createUser(input);

    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(typeof user.id).toBe("number");
    expect(user).toHaveProperty("name", "Valentin R");
    expect(user.birthday).toBeDefined();
    expect(user.birthday.getFullYear()).toBe(1997);
    expect(user.birthday.getMonth()).toBe(8);
    expect(user.birthday.getDate()).toBe(13);
    expect(userRepository.createUserInRepository).toHaveBeenCalledTimes(1);
    expect(userRepository.createUserInRepository).toHaveBeenCalledWith(input);
  });

  it("should trigger a bad request error when user creation", async () => {
    try {
      await createUser({
        name: "Valentin R",
      });
      throw new Error("createUser should trigger an error.");
    } catch (e) {
      expect(e).toBeDefined();
      expect(e.name).toBe("HttpBadRequest");
      expect(e.statusCode).toBe(400);
    }
  });
  
  it("should trigger a forbidden error when user is too young", async () => {
    const today = new Date();

    // Date qui rend l'utilisateur plus jeune que MIN_USER_AGE
    const tooYoungBirthday = new Date(
      today.getFullYear() - (MIN_USER_AGE - 1),
      today.getMonth(),
      today.getDate()
    );

    try {
      await createUser({
        name: "young user",
        birthday: tooYoungBirthday,
      });
      throw new Error("createUser should trigger an error for young users.");
    } catch (e) {
      expect(e).toBeDefined();
      expect(e.name).toBe("HttpForbidden");
      expect(e.statusCode).toBe(403);
      // on s'assure qu'aucune écriture en repo n'a été faite
      expect(userRepository.createUserInRepository).not.toHaveBeenCalled();
    }
  });

});
