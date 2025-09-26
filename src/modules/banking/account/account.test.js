import { describe, it, expect, vi, afterEach } from "vitest";
import * as accountRepository from "./account.repository";
import {
  createAccount,
  getAccounts,
  deleteAccount,
} from "./account.service";


vi.mock("./account.repository", async () => {
  const actual = await vi.importActual("./account.repository");
  return {
    ...actual,
    createAccountInRepository: vi.fn(),
    getAccountsFromRepository: vi.fn(),
    deleteAccountFromRepository: vi.fn(),
  };
});

describe("Account Service", () => {
  afterEach(() => {
    vi.clearAllMocks(); 
  });


  it("should create an account successfully", async () => {
    const userId = 1;
    const inputData = { amount: 100.0 };

  // on simule que le repository renvoie un compte avec id, userId et solde
    const expectedAccount = {
      id: 42,
      userId,
      amount: 100.0,
    };

    accountRepository.createAccountInRepository.mockResolvedValue(expectedAccount);

    const result = await createAccount(userId, inputData);

    expect(result).toBeDefined();
    expect(result.id).toBe(expectedAccount.id);
    expect(result.userId).toBe(userId);
    expect(result.amount).toBe(100.0);
    expect(accountRepository.createAccountInRepository).toHaveBeenCalledTimes(1);
    expect(accountRepository.createAccountInRepository).toHaveBeenCalledWith(userId, inputData.amount);
    });

  

  it("should fail to create an account with invalid data", async () => {
    const userId = 1;

    // Cas 1 : pas de data du tout
    await expect(createAccount(userId)).rejects.toMatchObject({
      name: "HttpBadRequest",
      statusCode: 400,
    });

    // Cas 2 : solde manquant
    await expect(createAccount(userId, {})).rejects.toMatchObject({
      name: "HttpBadRequest",
      statusCode: 400,
    });

    // Cas 3 : solde pas un nombre
    await expect(createAccount(userId, { amount: "NAN" })).rejects.toMatchObject({
      name: "HttpBadRequest",
      statusCode: 400,
    });

    expect(accountRepository.createAccountInRepository).not.toHaveBeenCalled();
  });




  it("should get all accounts for a user", async () => {
    const userId = 1;
    const mockAccounts = [
      { id: 101, userId, amount: 500.0 },
      { id: 102, userId, amount: 1200.5 },
      { id: 103, userId, amount: 0.0 },
    ];

    // Mock de la réponse du repository
    accountRepository.getAccountsFromRepository.mockResolvedValue(mockAccounts);

    const result = await getAccounts(userId);

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(3);

    // verif de chaque compte
    result.forEach((account, index) => {
      expect(account).toHaveProperty("id", mockAccounts[index].id);
      expect(account).toHaveProperty("userId", userId);
      expect(account).toHaveProperty("amount", mockAccounts[index].amount);
    });

    // verif que le repository a ete appelé correctement
    expect(accountRepository.getAccountsFromRepository).toHaveBeenCalledTimes(1);
    expect(accountRepository.getAccountsFromRepository).toHaveBeenCalledWith(userId);
  });


  it("should delete an account successfully", async () => {
    const userId = 1;
    const accountId = 42;

    const mockAccounts = [
      { id: 42, userId, amount: 300.0 },
      { id: 43, userId, amount: 100.0 },
    ];

    // Le repository renvoie ces comptes pour ce user
    accountRepository.getAccountsFromRepository.mockResolvedValue(mockAccounts);

    accountRepository.deleteAccountFromRepository.mockResolvedValue(true);

    const result = await deleteAccount(userId, accountId);

    expect(result).toBe(true);
    expect(accountRepository.getAccountsFromRepository).toHaveBeenCalledTimes(1);
    expect(accountRepository.getAccountsFromRepository).toHaveBeenCalledWith(userId);

    expect(accountRepository.deleteAccountFromRepository).toHaveBeenCalledTimes(1);
    expect(accountRepository.deleteAccountFromRepository).toHaveBeenCalledWith(accountId);
  });

  
 it("should fail to delete account with invalid accountId", async () => {
  const userId = 1;
  const invalidAccountId = 999;

  const mockAccounts = [
    { id: 42, userId, amount: 300.0 },
    { id: 43, userId, amount: 100.0 },
  ];

  accountRepository.getAccountsFromRepository.mockResolvedValue(mockAccounts);

  // appel a deleteAccount avec un ID errone 
  await expect(deleteAccount(userId, invalidAccountId)).rejects.toMatchObject({
    name: "HttpNotFound",
    statusCode: 404,
  });

  expect(accountRepository.deleteAccountFromRepository).not.toHaveBeenCalled();
});

});
