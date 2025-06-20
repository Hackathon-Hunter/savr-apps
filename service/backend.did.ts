import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface ToolCallArgument {
  value: string;
  name: string;
}

export interface FunctionCall {
  name: string;
  arguments: ToolCallArgument[];
}

export interface ToolCall {
  id: string;
  function: FunctionCall;
}

export interface AssistantMessage {
  content: [] | [string];
  tool_calls: ToolCall[];
}

export type ChatMessage =
  | { tool: { content: string; tool_call_id: string } }
  | { user: { content: string } }
  | { assistant: AssistantMessage }
  | { system: { content: string } };

export type SavingId = bigint;
export type SavingId__1 = bigint;
export type TransactionId = bigint;

export type TransactionStatus =
  | { Failed: string }
  | { Completed: null }
  | { Pending: null };

export type TransactionType =
  | { Saving: null }
  | { Withdrawal: null }
  | { TopUp: null }
  | { StakingReward: null }
  | { Unstaking: null }
  | { Staking: null };

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

export type TransactionResponse = { Ok: Transaction } | { Err: string };

export type SavingStatus =
  | { Active: null }
  | { Cancelled: null }
  | { Completed: null };

export interface TopUpHistory {
  date: bigint;
  amount: bigint;
}

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

export type NeuronState =
  | { Dissolved: null }
  | { Locked: null }
  | { Dissolving: null };

export interface StakingInfo {
  age: bigint;
  dissolveDelay: bigint;
  maturity: bigint;
  votingPower: bigint;
  createdAt: bigint;
  stake: bigint;
  state: NeuronState;
  neuronId: bigint;
  expectedAPY: number;
  lastRewardClaim: bigint;
}

export interface StakingRewards {
  pendingRewards: bigint;
  totalRewards: bigint;
  annualizedReturn: number;
  lastRewardDate: bigint;
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

export interface StakeICPRequest {
  dissolveDelay: bigint;
  savingId: SavingId__1;
  amount: bigint;
  principalId: string;
}

export interface StakeICPResponse {
  dissolveDelay: bigint;
  expectedRewards: bigint;
  stake: bigint;
  neuronId: bigint;
}

export type StakeResponse = { Ok: StakeICPResponse } | { Err: string };

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

export interface Saving {
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

export type SavingResponse = { Ok: Saving } | { Err: string };

export interface TopUpRequest {
  savingId: SavingId__1;
  amount: bigint;
  principalId: string;
}

export interface UnstakeRequest {
  savingId: SavingId__1;
  neuronId: bigint;
  principalId: string;
}

export type UnstakeResponse = { Ok: boolean } | { Err: string };

export interface UpdateSavingRequest {
  isStaking: [] | [boolean];
  savingName: [] | [string];
  savingId: SavingId__1;
  deadline: [] | [bigint];
  priorityLevel: [] | [bigint];
  totalSaving: [] | [bigint];
  savingsRate: [] | [bigint];
}

export interface PlatformStakingStats {
  totalRewardsDistributed: bigint;
  totalNeurons: bigint;
  totalStaked: bigint;
  averageStakeSize: bigint;
}

export interface UserStakingStats {
  totalRewards: bigint;
  activeStakes: bigint;
  averageAPY: number;
  totalStaked: bigint;
}

export interface _SERVICE {
  calculateStakingRewards: ActorMethod<[bigint, bigint, bigint], bigint>;
  chat: ActorMethod<[ChatMessage[]], string>;
  claimStakingRewards: ActorMethod<[SavingId, string], TransactionResponse>;
  cleanupDissolvedNeurons: ActorMethod<[], bigint>;
  followNeuron: ActorMethod<[bigint, Principal[]], boolean>;
  forceDissolveNeuron: ActorMethod<[SavingId, bigint], boolean>;
  getAccountIdFromPrincipal: ActorMethod<[string], string>;
  getAllTransactions: ActorMethod<[], Transaction__1[]>;
  getBalance: ActorMethod<[], bigint>;
  getBalanceByAccountId: ActorMethod<[string], bigint>;
  getBalanceByPrincipal: ActorMethod<[string], bigint>;
  getCanisterId: ActorMethod<[], Principal>;
  getMinimumStakeAmount: ActorMethod<[], bigint>;
  getNetworkAPY: ActorMethod<[], number>;
  getOwner: ActorMethod<[], Principal>;
  getPlatformStakingStats: ActorMethod<[], PlatformStakingStats>;
  getSavingTransactions: ActorMethod<[SavingId], Transaction__1[]>;
  getSavingWithHistory: ActorMethod<[SavingId], [] | [SavingWithHistory]>;
  getStakingInfo: ActorMethod<[SavingId], [] | [StakingInfo]>;
  getStakingRewards: ActorMethod<[SavingId], [] | [StakingRewards]>;
  getTransactionDetail: ActorMethod<[bigint], [] | [Transaction__1]>;
  getUserSavings: ActorMethod<[string], Saving__1[]>;
  getUserStakingPositions: ActorMethod<[string], [SavingId, StakingInfo][]>;
  getUserStakingStats: ActorMethod<[string], UserStakingStats>;
  getUserTransactions: ActorMethod<[string], Transaction__1[]>;
  isStakingPaused: ActorMethod<[], boolean>;
  migrateSavingsForStaking: ActorMethod<[], boolean>;
  pauseStaking: ActorMethod<[], boolean>;
  prompt: ActorMethod<[string], string>;
  resumeStaking: ActorMethod<[], boolean>;
  stakeICP: ActorMethod<[StakeICPRequest], StakeResponse>;
  startSaving: ActorMethod<[StartSavingRequest], SavingResponse>;
  topUpSaving: ActorMethod<[TopUpRequest], TransactionResponse>;
  transferOwnership: ActorMethod<[Principal], boolean>;
  unstakeICP: ActorMethod<[UnstakeRequest], UnstakeResponse>;
  updateDissolveDelay: ActorMethod<[SavingId, bigint, string], boolean>;
  updateSaving: ActorMethod<[UpdateSavingRequest], SavingResponse>;
  voteOnProposal: ActorMethod<[bigint, bigint, boolean], boolean>;
  withdrawSaving: ActorMethod<[SavingId], TransactionResponse>;
}

export const idlFactory: IDL.InterfaceFactory = ({ IDL }) => {
  const ToolCallArgument = IDL.Record({
    value: IDL.Text,
    name: IDL.Text,
  });
  const FunctionCall = IDL.Record({
    name: IDL.Text,
    arguments: IDL.Vec(ToolCallArgument),
  });
  const ToolCall = IDL.Record({ id: IDL.Text, function: FunctionCall });
  const AssistantMessage = IDL.Record({
    content: IDL.Opt(IDL.Text),
    tool_calls: IDL.Vec(ToolCall),
  });
  const ChatMessage = IDL.Variant({
    tool: IDL.Record({ content: IDL.Text, tool_call_id: IDL.Text }),
    user: IDL.Record({ content: IDL.Text }),
    assistant: AssistantMessage,
    system: IDL.Record({ content: IDL.Text }),
  });
  const SavingId = IDL.Nat;
  const TransactionId = IDL.Nat;
  const TransactionStatus = IDL.Variant({
    Failed: IDL.Text,
    Completed: IDL.Null,
    Pending: IDL.Null,
  });
  const TransactionType = IDL.Variant({
    Saving: IDL.Null,
    Withdrawal: IDL.Null,
    TopUp: IDL.Null,
    StakingReward: IDL.Null,
    Unstaking: IDL.Null,
    Staking: IDL.Null,
  });
  const SavingId__1 = IDL.Nat;
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
  const TransactionResponse = IDL.Variant({
    Ok: Transaction,
    Err: IDL.Text,
  });
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
  const NeuronState = IDL.Variant({
    Dissolved: IDL.Null,
    Locked: IDL.Null,
    Dissolving: IDL.Null,
  });
  const StakingInfo = IDL.Record({
    age: IDL.Int,
    dissolveDelay: IDL.Nat64,
    maturity: IDL.Nat64,
    votingPower: IDL.Nat64,
    createdAt: IDL.Int,
    stake: IDL.Nat64,
    state: NeuronState,
    neuronId: IDL.Nat64,
    expectedAPY: IDL.Float64,
    lastRewardClaim: IDL.Int,
  });
  const StakingRewards = IDL.Record({
    pendingRewards: IDL.Nat64,
    totalRewards: IDL.Nat64,
    annualizedReturn: IDL.Float64,
    lastRewardDate: IDL.Int,
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
  const StakeICPRequest = IDL.Record({
    dissolveDelay: IDL.Nat64,
    savingId: SavingId__1,
    amount: IDL.Nat64,
    principalId: IDL.Text,
  });
  const StakeICPResponse = IDL.Record({
    dissolveDelay: IDL.Nat64,
    expectedRewards: IDL.Nat64,
    stake: IDL.Nat64,
    neuronId: IDL.Nat64,
  });
  const StakeResponse = IDL.Variant({
    Ok: StakeICPResponse,
    Err: IDL.Text,
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
  const UnstakeRequest = IDL.Record({
    savingId: SavingId__1,
    neuronId: IDL.Nat64,
    principalId: IDL.Text,
  });
  const UnstakeResponse = IDL.Variant({ Ok: IDL.Bool, Err: IDL.Text });
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
    calculateStakingRewards: IDL.Func(
      [IDL.Nat64, IDL.Nat64, IDL.Nat64],
      [IDL.Nat64],
      ["query"]
    ),
    chat: IDL.Func([IDL.Vec(ChatMessage)], [IDL.Text], []),
    claimStakingRewards: IDL.Func(
      [SavingId, IDL.Text],
      [TransactionResponse],
      []
    ),
    cleanupDissolvedNeurons: IDL.Func([], [IDL.Nat], []),
    followNeuron: IDL.Func([IDL.Nat64, IDL.Vec(IDL.Principal)], [IDL.Bool], []),
    forceDissolveNeuron: IDL.Func([SavingId, IDL.Nat64], [IDL.Bool], []),
    getAccountIdFromPrincipal: IDL.Func([IDL.Text], [IDL.Text], ["query"]),
    getAllTransactions: IDL.Func([], [IDL.Vec(Transaction__1)], ["query"]),
    getBalance: IDL.Func([], [IDL.Nat64], []),
    getBalanceByAccountId: IDL.Func([IDL.Text], [IDL.Nat64], []),
    getBalanceByPrincipal: IDL.Func([IDL.Text], [IDL.Nat64], []),
    getCanisterId: IDL.Func([], [IDL.Principal], ["query"]),
    getMinimumStakeAmount: IDL.Func([], [IDL.Nat64], ["query"]),
    getNetworkAPY: IDL.Func([], [IDL.Float64], ["query"]),
    getOwner: IDL.Func([], [IDL.Principal], ["query"]),
    getPlatformStakingStats: IDL.Func(
      [],
      [
        IDL.Record({
          totalRewardsDistributed: IDL.Nat64,
          totalNeurons: IDL.Nat,
          totalStaked: IDL.Nat64,
          averageStakeSize: IDL.Nat64,
        }),
      ],
      ["query"]
    ),
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
    getStakingInfo: IDL.Func([SavingId], [IDL.Opt(StakingInfo)], ["query"]),
    getStakingRewards: IDL.Func(
      [SavingId],
      [IDL.Opt(StakingRewards)],
      ["query"]
    ),
    getTransactionDetail: IDL.Func(
      [IDL.Nat],
      [IDL.Opt(Transaction__1)],
      ["query"]
    ),
    getUserSavings: IDL.Func([IDL.Text], [IDL.Vec(Saving__1)], ["query"]),
    getUserStakingPositions: IDL.Func(
      [IDL.Text],
      [IDL.Vec(IDL.Tuple(SavingId, StakingInfo))],
      ["query"]
    ),
    getUserStakingStats: IDL.Func(
      [IDL.Text],
      [
        IDL.Record({
          totalRewards: IDL.Nat64,
          activeStakes: IDL.Nat,
          averageAPY: IDL.Float64,
          totalStaked: IDL.Nat64,
        }),
      ],
      ["query"]
    ),
    getUserTransactions: IDL.Func(
      [IDL.Text],
      [IDL.Vec(Transaction__1)],
      ["query"]
    ),
    isStakingPaused: IDL.Func([], [IDL.Bool], ["query"]),
    migrateSavingsForStaking: IDL.Func([], [IDL.Bool], []),
    pauseStaking: IDL.Func([], [IDL.Bool], []),
    prompt: IDL.Func([IDL.Text], [IDL.Text], []),
    resumeStaking: IDL.Func([], [IDL.Bool], []),
    stakeICP: IDL.Func([StakeICPRequest], [StakeResponse], []),
    startSaving: IDL.Func([StartSavingRequest], [SavingResponse], []),
    topUpSaving: IDL.Func([TopUpRequest], [TransactionResponse], []),
    transferOwnership: IDL.Func([IDL.Principal], [IDL.Bool], []),
    unstakeICP: IDL.Func([UnstakeRequest], [UnstakeResponse], []),
    updateDissolveDelay: IDL.Func([SavingId, IDL.Nat64, IDL.Text], [IDL.Bool], []),
    updateSaving: IDL.Func([UpdateSavingRequest], [SavingResponse], []),
    voteOnProposal: IDL.Func([IDL.Nat64, IDL.Nat64, IDL.Bool], [IDL.Bool], []),
    withdrawSaving: IDL.Func([SavingId], [TransactionResponse], []),
  });
};

export const init: (args: { IDL: typeof IDL }) => IDL.Type[] = () => {
  return [];
};