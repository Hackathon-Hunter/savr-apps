import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface Saving {
  id: SavingId;
  status: SavingStatus;
  isStaking: boolean;
  savingName: string;
  createdAt: bigint;
  deadline: bigint;
  updatedAt: bigint;
  priorityLevel: bigint;
  currentAmount: bigint;
  amount: bigint;
  principalId: Principal;
  totalSaving: bigint;
  savingsRate: bigint;
}
export type SavingId = bigint;
export type SavingId__1 = bigint;
export type SavingResponse = { Ok: Saving } | { Err: string };
export type SavingStatus =
  | { Active: null }
  | { Cancelled: null }
  | { Completed: null };
export interface SavingWithHistory {
  id: SavingId;
  status: SavingStatus;
  topUpHistory: Array<TopUpHistory>;
  isStaking: boolean;
  savingName: string;
  createdAt: bigint;
  deadline: bigint;
  updatedAt: bigint;
  priorityLevel: bigint;
  currentAmount: bigint;
  amount: bigint;
  principalId: Principal;
  totalSaving: bigint;
  savingsRate: bigint;
}
export interface Saving__1 {
  id: SavingId;
  status: SavingStatus;
  isStaking: boolean;
  savingName: string;
  createdAt: bigint;
  deadline: bigint;
  updatedAt: bigint;
  priorityLevel: bigint;
  currentAmount: bigint;
  amount: bigint;
  principalId: Principal;
  totalSaving: bigint;
  savingsRate: bigint;
}
export interface StartSavingRequest {
  isStaking: [] | [boolean];
  savingName: string;
  deadline: bigint;
  priorityLevel: [] | [bigint];
  amount: bigint;
  principalId: string;
  totalSaving: bigint;
  savingsRate: [] | [bigint];
}
export interface TopUpHistory {
  date: bigint;
  amount: bigint;
}
export interface TopUpRequest {
  savingId: SavingId;
  amount: bigint;
  principalId: string;
}
export interface Transaction {
  id: TransactionId;
  to: Principal;
  status: TransactionStatus;
  transactionType: TransactionType;
  from: Principal;
  memo: [] | [string];
  savingId: [] | [SavingId];
  blockIndex: [] | [bigint];
  timestamp: bigint;
  amount: bigint;
}
export type TransactionId = bigint;
export type TransactionResponse = { Ok: Transaction } | { Err: string };
export type TransactionStatus =
  | { Failed: string }
  | { Completed: null }
  | { Pending: null };
export type TransactionType = { Saving: null } | { TopUp: null };
export interface Transaction__1 {
  id: TransactionId;
  to: Principal;
  status: TransactionStatus;
  transactionType: TransactionType;
  from: Principal;
  memo: [] | [string];
  savingId: [] | [SavingId];
  blockIndex: [] | [bigint];
  timestamp: bigint;
  amount: bigint;
}
export interface UpdateSavingRequest {
  isStaking: [] | [boolean];
  savingName: [] | [string];
  savingId: SavingId;
  deadline: [] | [bigint];
  priorityLevel: [] | [bigint];
  totalSaving: [] | [bigint];
  savingsRate: [] | [bigint];
}
export interface _SERVICE {
  getAllTransactions: ActorMethod<[], Array<Transaction__1>>;
  getCanisterId: ActorMethod<[], Principal>;
  getOwner: ActorMethod<[], Principal>;
  getSavingTransactions: ActorMethod<[SavingId__1], Array<Transaction__1>>;
  getSavingWithHistory: ActorMethod<[SavingId__1], [] | [SavingWithHistory]>;
  getTransactionDetail: ActorMethod<[bigint], [] | [Transaction__1]>;
  getUserSavings: ActorMethod<[string], Array<Saving__1>>;
  getUserTransactions: ActorMethod<[string], Array<Transaction__1>>;
  startSaving: ActorMethod<[StartSavingRequest], SavingResponse>;
  topUpSaving: ActorMethod<[TopUpRequest], TransactionResponse>;
  transferOwnership: ActorMethod<[Principal], boolean>;
  updateSaving: ActorMethod<[UpdateSavingRequest], SavingResponse>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
