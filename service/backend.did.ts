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
  currentAmount: bigint; // IDL.Nat64 -> bigint
  amount: bigint; // IDL.Nat64 -> bigint
  principalId: Principal;
  totalSaving: bigint; // IDL.Nat64 -> bigint
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
  currentAmount: bigint; // IDL.Nat64 -> bigint
  amount: bigint; // IDL.Nat64 -> bigint
  principalId: Principal;
  totalSaving: bigint; // IDL.Nat64 -> bigint
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
  currentAmount: bigint; // IDL.Nat64 -> bigint
  amount: bigint; // IDL.Nat64 -> bigint
  principalId: Principal;
  totalSaving: bigint; // IDL.Nat64 -> bigint
  savingsRate: bigint;
}
export interface StartSavingRequest {
  isStaking: [] | [boolean];
  savingName: string;
  deadline: bigint;
  priorityLevel: [] | [bigint];
  amount: bigint; // IDL.Nat64 -> bigint
  principalId: string;
  totalSaving: bigint; // IDL.Nat64 -> bigint
  savingsRate: [] | [bigint];
}
export interface TopUpHistory {
  date: bigint;
  amount: bigint; // IDL.Nat64 -> bigint
}
export interface TopUpRequest {
  savingId: SavingId;
  amount: bigint; // IDL.Nat64 -> bigint
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
  blockIndex: [] | [bigint]; // IDL.Nat64 -> bigint
  timestamp: bigint;
  amount: bigint; // IDL.Nat64 -> bigint
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
  blockIndex: [] | [bigint]; // IDL.Nat64 -> bigint
  timestamp: bigint;
  amount: bigint; // IDL.Nat64 -> bigint
}
export interface UpdateSavingRequest {
  isStaking: [] | [boolean];
  savingName: [] | [string];
  savingId: SavingId;
  deadline: [] | [bigint];
  priorityLevel: [] | [bigint];
  totalSaving: [] | [bigint]; // IDL.Nat64 -> bigint
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

export const idlFactory: IDL.InterfaceFactory = ({ IDL }) => {
  const TransactionId = IDL.Nat;
  const TransactionStatus = IDL.Variant({
    Failed: IDL.Text,
    Completed: IDL.Null,
    Pending: IDL.Null,
  });
  const TransactionType = IDL.Variant({
    Saving: IDL.Null,
    TopUp: IDL.Null,
  });
  const SavingId = IDL.Nat;
  const Transaction__1 = IDL.Record({
    id: TransactionId,
    to: IDL.Principal,
    status: TransactionStatus,
    transactionType: TransactionType,
    from: IDL.Principal,
    memo: IDL.Opt(IDL.Text),
    savingId: IDL.Opt(SavingId),
    blockIndex: IDL.Opt(IDL.Nat64),
    timestamp: IDL.Int,
    amount: IDL.Nat64,
  });
  const SavingId__1 = IDL.Nat;
  const SavingStatus = IDL.Variant({
    Active: IDL.Null,
    Cancelled: IDL.Null,
    Completed: IDL.Null,
  });
  const TopUpHistory = IDL.Record({ date: IDL.Int, amount: IDL.Nat64 });
  const SavingWithHistory = IDL.Record({
    id: SavingId,
    status: SavingStatus,
    topUpHistory: IDL.Vec(TopUpHistory),
    isStaking: IDL.Bool,
    savingName: IDL.Text,
    createdAt: IDL.Int,
    deadline: IDL.Int,
    updatedAt: IDL.Int,
    priorityLevel: IDL.Nat,
    currentAmount: IDL.Nat64,
    amount: IDL.Nat64,
    principalId: IDL.Principal,
    totalSaving: IDL.Nat64,
    savingsRate: IDL.Nat,
  });
  const Saving__1 = IDL.Record({
    id: SavingId,
    status: SavingStatus,
    isStaking: IDL.Bool,
    savingName: IDL.Text,
    createdAt: IDL.Int,
    deadline: IDL.Int,
    updatedAt: IDL.Int,
    priorityLevel: IDL.Nat,
    currentAmount: IDL.Nat64,
    amount: IDL.Nat64,
    principalId: IDL.Principal,
    totalSaving: IDL.Nat64,
    savingsRate: IDL.Nat,
  });
  const StartSavingRequest = IDL.Record({
    isStaking: IDL.Opt(IDL.Bool),
    savingName: IDL.Text,
    deadline: IDL.Int,
    priorityLevel: IDL.Opt(IDL.Nat),
    amount: IDL.Nat64,
    principalId: IDL.Text,
    totalSaving: IDL.Nat64,
    savingsRate: IDL.Opt(IDL.Nat),
  });
  const Saving = IDL.Record({
    id: SavingId,
    status: SavingStatus,
    isStaking: IDL.Bool,
    savingName: IDL.Text,
    createdAt: IDL.Int,
    deadline: IDL.Int,
    updatedAt: IDL.Int,
    priorityLevel: IDL.Nat,
    currentAmount: IDL.Nat64,
    amount: IDL.Nat64,
    principalId: IDL.Principal,
    totalSaving: IDL.Nat64,
    savingsRate: IDL.Nat,
  });
  const SavingResponse = IDL.Variant({ Ok: Saving, Err: IDL.Text });
  const TopUpRequest = IDL.Record({
    savingId: SavingId,
    amount: IDL.Nat64,
    principalId: IDL.Text,
  });
  const Transaction = IDL.Record({
    id: TransactionId,
    to: IDL.Principal,
    status: TransactionStatus,
    transactionType: TransactionType,
    from: IDL.Principal,
    memo: IDL.Opt(IDL.Text),
    savingId: IDL.Opt(SavingId),
    blockIndex: IDL.Opt(IDL.Nat64),
    timestamp: IDL.Int,
    amount: IDL.Nat64,
  });
  const TransactionResponse = IDL.Variant({
    Ok: Transaction,
    Err: IDL.Text,
  });
  const UpdateSavingRequest = IDL.Record({
    isStaking: IDL.Opt(IDL.Bool),
    savingName: IDL.Opt(IDL.Text),
    savingId: SavingId,
    deadline: IDL.Opt(IDL.Int),
    priorityLevel: IDL.Opt(IDL.Nat),
    totalSaving: IDL.Opt(IDL.Nat64),
    savingsRate: IDL.Opt(IDL.Nat),
  });
  return IDL.Service({
    getAllTransactions: IDL.Func([], [IDL.Vec(Transaction__1)], ["query"]),
    getCanisterId: IDL.Func([], [IDL.Principal], ["query"]),
    getOwner: IDL.Func([], [IDL.Principal], ["query"]),
    getSavingTransactions: IDL.Func(
      [SavingId__1],
      [IDL.Vec(Transaction__1)],
      ["query"]
    ),
    getSavingWithHistory: IDL.Func(
      [SavingId__1],
      [IDL.Opt(SavingWithHistory)],
      ["query"]
    ),
    getTransactionDetail: IDL.Func(
      [IDL.Nat],
      [IDL.Opt(Transaction__1)],
      ["query"]
    ),
    getUserSavings: IDL.Func([IDL.Text], [IDL.Vec(Saving__1)], ["query"]),
    getUserTransactions: IDL.Func(
      [IDL.Text],
      [IDL.Vec(Transaction__1)],
      ["query"]
    ),
    startSaving: IDL.Func([StartSavingRequest], [SavingResponse], []),
    topUpSaving: IDL.Func([TopUpRequest], [TransactionResponse], []),
    transferOwnership: IDL.Func([IDL.Principal], [IDL.Bool], []),
    updateSaving: IDL.Func([UpdateSavingRequest], [SavingResponse], []),
  });
};

export const init: (args: { IDL: typeof IDL }) => IDL.Type[] = () => {
  return [];
};
