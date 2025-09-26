import { HttpBadRequest, HttpNotFound } from "@httpx/exception";
import {
  createAccountInRepository,
  getAccountsFromRepository,
  deleteAccountFromRepository,
} from "./account.repository";

export async function createAccount(userId, data) {
  if (!data || typeof data.amount !== "number") {
    throw new HttpBadRequest("Invalid amount provided");
  }

  return await createAccountInRepository(userId, data.amount);
}


export async function getAccounts(userId) {
  return await getAccountsFromRepository(userId);
}


export async function deleteAccount(userId, accountId) {
  const accounts = await getAccountsFromRepository(userId);
  const found = accounts.find((acc) => acc.id === accountId);

  if (!found) {
    throw new HttpNotFound("Account not found for this user");
  }

  return await deleteAccountFromRepository(accountId);
}

