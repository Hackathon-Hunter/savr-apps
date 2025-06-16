import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface Account {
  owner: Principal;
  subaccount: [] | [Uint8Array];
}

export interface Account__1 {
  owner: Principal;
  subaccount: [] | [Uint8Array];
}

export interface Allowance {
  allowance: bigint;
  expires_at: [] | [bigint];
}

export interface AllowanceArgs {
  account: Account;
  spender: Account;
}

export interface ApproveArgs {
  fee: [] | [bigint];
  memo: [] | [Uint8Array];
  from_subaccount: [] | [Uint8Array];
  created_at_time: [] | [bigint];
  amount: bigint;
  expected_allowance: [] | [bigint];
  expires_at: [] | [bigint];
  spender: Account;
}

export type ApproveError =
  | {
    GenericError: { message: string; error_code: bigint };
  }
  | { TemporarilyUnavailable: null }
  | { Duplicate: { duplicate_of: bigint } }
  | { BadFee: { expected_fee: bigint } }
  | { AllowanceChanged: { current_allowance: bigint } }
  | { CreatedInFuture: { ledger_time: bigint } }
  | { TooOld: null }
  | { Expired: { ledger_time: bigint } }
  | { InsufficientFunds: { balance: bigint } };

export type ApproveResult = { Ok: bigint } | { Err: ApproveError };

export interface Archive {
  canister_id: Principal;
  start: bigint;
  length: bigint;
}

export interface ArchivedTransactionResponse {
  args: GetTransactionsRequest__1[];
  callback: ActorMethod<[GetTransactionsRequest__1], GetTransactionsResponse__1>;
}

export interface BlockType {
  url: string;
  block_type: string;
}

export interface GetTransactionsRequest {
  start: bigint;
  length: bigint;
}

export interface GetTransactionsRequest__1 {
  start: bigint;
  length: bigint;
}

export interface GetTransactionsResponse {
  log_length: bigint;
  transactions: TransactionWithId[];
  archived_transactions: ArchivedTransactionResponse[];
}

export interface GetTransactionsResponse__1 {
  log_length: bigint;
  transactions: TransactionWithId[];
  archived_transactions: ArchivedTransactionResponse[];
}

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
  id: SavingId__1;
  status: SavingStatus;
  topUpHistory: TopUpHistory[];
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
  id: SavingId__1;
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

export interface SupportedStandard {
  url: string;
  name: string;
}

export interface TopUpHistory {
  date: bigint;
  amount: bigint;
}

export interface TopUpRequest {
  savingId: SavingId__1;
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
  savingId: [] | [SavingId__1];
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
  savingId: [] | [SavingId__1];
  blockIndex: [] | [bigint];
  timestamp: bigint;
  amount: bigint;
}

export interface TransactionWithId {
  id: bigint;
  transaction: Transaction;
}

export interface TransferFromArgs {
  to: Account;
  fee: [] | [bigint];
  spender_subaccount: [] | [Uint8Array];
  from: Account;
  memo: [] | [Uint8Array];
  created_at_time: [] | [bigint];
  amount: bigint;
}

export type TransferFromError =
  | {
    GenericError: { message: string; error_code: bigint };
  }
  | { TemporarilyUnavailable: null }
  | { InsufficientAllowance: { allowance: bigint } }
  | { BadBurn: { min_burn_amount: bigint } }
  | { Duplicate: { duplicate_of: bigint } }
  | { BadFee: { expected_fee: bigint } }
  | { CreatedInFuture: { ledger_time: bigint } }
  | { TooOld: null }
  | { InsufficientFunds: { balance: bigint } };

export type TransferFromResult = { Ok: bigint } | { Err: TransferFromError };

export interface UpdateSavingRequest {
  isStaking: [] | [boolean];
  savingName: [] | [string];
  savingId: SavingId__1;
  deadline: [] | [bigint];
  priorityLevel: [] | [bigint];
  totalSaving: [] | [bigint];
  savingsRate: [] | [bigint];
}

export type Value =
  | { Int: bigint }
  | { Nat: bigint }
  | { Blob: Uint8Array }
  | { Text: string }
  | { Array: Value[] };

export interface _SERVICE {
  getAccountIdFromPrincipal: ActorMethod<[string], string>;
  getAllTransactions: ActorMethod<[], Transaction__1[]>;
  getBalance: ActorMethod<[], bigint>;
  getBalanceByAccountId: ActorMethod<[string], bigint>;
  getBalanceByPrincipal: ActorMethod<[string], bigint>;
  getCanisterAccountId: ActorMethod<[], string>;
  getCanisterId: ActorMethod<[], Principal>;
  getOwner: ActorMethod<[], Principal>;
  getSavingTransactions: ActorMethod<[SavingId], Transaction__1[]>;
  getSavingWithHistory: ActorMethod<[SavingId], [] | [SavingWithHistory]>;
  getTransactionDetail: ActorMethod<[bigint], [] | [Transaction__1]>;
  getUserSavings: ActorMethod<[string], Saving__1[]>;
  getUserTransactions: ActorMethod<[string], Transaction__1[]>;
  icrc10_supported_standards: ActorMethod<[], SupportedStandard[]>;
  icrc1_balance_of: ActorMethod<[Account__1], bigint>;
  icrc1_decimals: ActorMethod<[], number>;
  icrc1_fee: ActorMethod<[], bigint>;
  icrc1_metadata: ActorMethod<[], [string, Value][]>;
  icrc1_minting_account: ActorMethod<[], [] | [Account__1]>;
  icrc1_name: ActorMethod<[], string>;
  icrc1_supported_standards: ActorMethod<[], SupportedStandard[]>;
  icrc1_symbol: ActorMethod<[], string>;
  icrc1_total_supply: ActorMethod<[], bigint>;
  icrc2_allowance: ActorMethod<[AllowanceArgs], Allowance>;
  icrc2_approve: ActorMethod<[ApproveArgs], ApproveResult>;
  icrc2_transfer_from: ActorMethod<[TransferFromArgs], TransferFromResult>;
  icrc3_get_archives: ActorMethod<[], Archive[]>;
  icrc3_get_tip_certificate: ActorMethod<[], [] | [Uint8Array]>;
  icrc3_get_transactions: ActorMethod<
    [GetTransactionsRequest],
    GetTransactionsResponse
  >;
  icrc3_supported_block_types: ActorMethod<[], BlockType[]>;
  startSaving: ActorMethod<[StartSavingRequest], SavingResponse>;
  topUpSaving: ActorMethod<[TopUpRequest], TransactionResponse>;
  transferOwnership: ActorMethod<[Principal], boolean>;
  updateSaving: ActorMethod<[UpdateSavingRequest], SavingResponse>;
  withdrawSaving: ActorMethod<[SavingId], TransactionResponse>;
}

export const idlFactory: IDL.InterfaceFactory = ({ IDL }) => {
  const ArchivedTransactionResponse = IDL.Rec();
  const Value = IDL.Rec();
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
  const SavingId__1 = IDL.Nat;
  const Transaction__1 = IDL.Record({
    id: TransactionId,
    to: IDL.Principal,
    status: TransactionStatus,
    transactionType: TransactionType,
    from: IDL.Principal,
    memo: IDL.Opt(IDL.Text),
    savingId: IDL.Opt(SavingId__1),
    blockIndex: IDL.Opt(IDL.Nat64),
    timestamp: IDL.Int,
    amount: IDL.Nat64,
  });
  const SavingId = IDL.Nat;
  const SavingStatus = IDL.Variant({
    Active: IDL.Null,
    Cancelled: IDL.Null,
    Completed: IDL.Null,
  });
  const TopUpHistory = IDL.Record({ date: IDL.Int, amount: IDL.Nat64 });
  const SavingWithHistory = IDL.Record({
    id: SavingId__1,
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
    id: SavingId__1,
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
  const SupportedStandard = IDL.Record({ url: IDL.Text, name: IDL.Text });
  const Account__1 = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  Value.fill(
    IDL.Variant({
      Int: IDL.Int,
      Nat: IDL.Nat,
      Blob: IDL.Vec(IDL.Nat8),
      Text: IDL.Text,
      Array: IDL.Vec(Value),
    })
  );
  const Account = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const AllowanceArgs = IDL.Record({
    account: Account,
    spender: Account,
  });
  const Allowance = IDL.Record({
    allowance: IDL.Nat,
    expires_at: IDL.Opt(IDL.Nat64),
  });
  const ApproveArgs = IDL.Record({
    fee: IDL.Opt(IDL.Nat),
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    created_at_time: IDL.Opt(IDL.Nat64),
    amount: IDL.Nat,
    expected_allowance: IDL.Opt(IDL.Nat),
    expires_at: IDL.Opt(IDL.Nat64),
    spender: Account,
  });
  const ApproveError = IDL.Variant({
    GenericError: IDL.Record({
      message: IDL.Text,
      error_code: IDL.Nat,
    }),
    TemporarilyUnavailable: IDL.Null,
    Duplicate: IDL.Record({ duplicate_of: IDL.Nat }),
    BadFee: IDL.Record({ expected_fee: IDL.Nat }),
    AllowanceChanged: IDL.Record({ current_allowance: IDL.Nat }),
    CreatedInFuture: IDL.Record({ ledger_time: IDL.Nat64 }),
    TooOld: IDL.Null,
    Expired: IDL.Record({ ledger_time: IDL.Nat64 }),
    InsufficientFunds: IDL.Record({ balance: IDL.Nat }),
  });
  const ApproveResult = IDL.Variant({ Ok: IDL.Nat, Err: ApproveError });
  const TransferFromArgs = IDL.Record({
    to: Account,
    fee: IDL.Opt(IDL.Nat),
    spender_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    from: Account,
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    created_at_time: IDL.Opt(IDL.Nat64),
    amount: IDL.Nat,
  });
  const TransferFromError = IDL.Variant({
    GenericError: IDL.Record({
      message: IDL.Text,
      error_code: IDL.Nat,
    }),
    TemporarilyUnavailable: IDL.Null,
    InsufficientAllowance: IDL.Record({ allowance: IDL.Nat }),
    BadBurn: IDL.Record({ min_burn_amount: IDL.Nat }),
    Duplicate: IDL.Record({ duplicate_of: IDL.Nat }),
    BadFee: IDL.Record({ expected_fee: IDL.Nat }),
    CreatedInFuture: IDL.Record({ ledger_time: IDL.Nat64 }),
    TooOld: IDL.Null,
    InsufficientFunds: IDL.Record({ balance: IDL.Nat }),
  });
  const TransferFromResult = IDL.Variant({
    Ok: IDL.Nat,
    Err: TransferFromError,
  });
  const Archive = IDL.Record({
    canister_id: IDL.Principal,
    start: IDL.Nat,
    length: IDL.Nat,
  });
  const GetTransactionsRequest = IDL.Record({
    start: IDL.Nat,
    length: IDL.Nat,
  });
  const Transaction = IDL.Record({
    id: TransactionId,
    to: IDL.Principal,
    status: TransactionStatus,
    transactionType: TransactionType,
    from: IDL.Principal,
    memo: IDL.Opt(IDL.Text),
    savingId: IDL.Opt(SavingId__1),
    blockIndex: IDL.Opt(IDL.Nat64),
    timestamp: IDL.Int,
    amount: IDL.Nat64,
  });
  const TransactionWithId = IDL.Record({
    id: IDL.Nat,
    transaction: Transaction,
  });
  const GetTransactionsRequest__1 = IDL.Record({
    start: IDL.Nat,
    length: IDL.Nat,
  });
  const GetTransactionsResponse__1 = IDL.Record({
    log_length: IDL.Nat,
    transactions: IDL.Vec(TransactionWithId),
    archived_transactions: IDL.Vec(ArchivedTransactionResponse),
  });
  ArchivedTransactionResponse.fill(
    IDL.Record({
      args: IDL.Vec(GetTransactionsRequest__1),
      callback: IDL.Func(
        [GetTransactionsRequest__1],
        [GetTransactionsResponse__1],
        ["query"]
      ),
    })
  );
  const GetTransactionsResponse = IDL.Record({
    log_length: IDL.Nat,
    transactions: IDL.Vec(TransactionWithId),
    archived_transactions: IDL.Vec(ArchivedTransactionResponse),
  });
  const BlockType = IDL.Record({ url: IDL.Text, block_type: IDL.Text });
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
    id: SavingId__1,
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
    savingId: SavingId__1,
    amount: IDL.Nat64,
    principalId: IDL.Text,
  });
  const TransactionResponse = IDL.Variant({
    Ok: Transaction,
    Err: IDL.Text,
  });
  const UpdateSavingRequest = IDL.Record({
    isStaking: IDL.Opt(IDL.Bool),
    savingName: IDL.Opt(IDL.Text),
    savingId: SavingId__1,
    deadline: IDL.Opt(IDL.Int),
    priorityLevel: IDL.Opt(IDL.Nat),
    totalSaving: IDL.Opt(IDL.Nat64),
    savingsRate: IDL.Opt(IDL.Nat),
  });
  return IDL.Service({
    getAccountIdFromPrincipal: IDL.Func([IDL.Text], [IDL.Text], ["query"]),
    getAllTransactions: IDL.Func([], [IDL.Vec(Transaction__1)], ["query"]),
    getBalance: IDL.Func([], [IDL.Nat64], []),
    getBalanceByAccountId: IDL.Func([IDL.Text], [IDL.Nat64], []),
    getBalanceByPrincipal: IDL.Func([IDL.Text], [IDL.Nat64], []),
    getCanisterAccountId: IDL.Func([], [IDL.Text], ["query"]),
    getCanisterId: IDL.Func([], [IDL.Principal], ["query"]),
    getOwner: IDL.Func([], [IDL.Principal], ["query"]),
    getSavingTransactions: IDL.Func(
      [SavingId],
      [IDL.Vec(Transaction__1)],
      ["query"]
    ),
    getSavingWithHistory: IDL.Func(
      [SavingId],
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
    icrc10_supported_standards: IDL.Func(
      [],
      [IDL.Vec(SupportedStandard)],
      ["query"]
    ),
    icrc1_balance_of: IDL.Func([Account__1], [IDL.Nat], ["query"]),
    icrc1_decimals: IDL.Func([], [IDL.Nat8], ["query"]),
    icrc1_fee: IDL.Func([], [IDL.Nat], ["query"]),
    icrc1_metadata: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Text, Value))],
      ["query"]
    ),
    icrc1_minting_account: IDL.Func([], [IDL.Opt(Account__1)], ["query"]),
    icrc1_name: IDL.Func([], [IDL.Text], ["query"]),
    icrc1_supported_standards: IDL.Func(
      [],
      [IDL.Vec(SupportedStandard)],
      ["query"]
    ),
    icrc1_symbol: IDL.Func([], [IDL.Text], ["query"]),
    icrc1_total_supply: IDL.Func([], [IDL.Nat], ["query"]),
    icrc2_allowance: IDL.Func([AllowanceArgs], [Allowance], ["query"]),
    icrc2_approve: IDL.Func([ApproveArgs], [ApproveResult], []),
    icrc2_transfer_from: IDL.Func([TransferFromArgs], [TransferFromResult], []),
    icrc3_get_archives: IDL.Func([], [IDL.Vec(Archive)], ["query"]),
    icrc3_get_tip_certificate: IDL.Func(
      [],
      [IDL.Opt(IDL.Vec(IDL.Nat8))],
      ["query"]
    ),
    icrc3_get_transactions: IDL.Func(
      [GetTransactionsRequest],
      [GetTransactionsResponse],
      ["query"]
    ),
    icrc3_supported_block_types: IDL.Func([], [IDL.Vec(BlockType)], ["query"]),
    startSaving: IDL.Func([StartSavingRequest], [SavingResponse], []),
    topUpSaving: IDL.Func([TopUpRequest], [TransactionResponse], []),
    transferOwnership: IDL.Func([IDL.Principal], [IDL.Bool], []),
    updateSaving: IDL.Func([UpdateSavingRequest], [SavingResponse], []),
    withdrawSaving: IDL.Func([SavingId], [TransactionResponse], []),
  });
};

export const init: (args: { IDL: typeof IDL }) => IDL.Type[] = () => {
  return [];
};