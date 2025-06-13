import { useState, useEffect, useCallback } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent";
import { _SERVICE, idlFactory } from "@/service/backend.did";

const identityProvider = "https://identity.ic0.app";
const canisterId = "3ykjv-vqaaa-aaaaj-a2beq-cai";

type AuthState = {
  actor: ActorSubclass<_SERVICE> | undefined;
  authClient: AuthClient | undefined;
  isAuthenticated: boolean;
  principal: string;
  isLoading: boolean;
};

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    actor: undefined,
    authClient: undefined,
    isAuthenticated: false,
    principal: 'Click "Whoami" to see your principal ID',
    isLoading: true,
  });

  const updateActor = useCallback(async () => {
    try {
      const authClient = await AuthClient.create();
      const identity = authClient.getIdentity();

      const agent = new HttpAgent({ identity, host: "https://ic0.app/" });

      const actor: ActorSubclass<_SERVICE> = Actor.createActor<_SERVICE>(
        idlFactory,
        {
          canisterId,
          agent,
        }
      );
      const isAuthenticated = await authClient.isAuthenticated();

      setState((prev) => ({
        ...prev,
        actor,
        authClient,
        isAuthenticated,
        principal: identity.getPrincipal().toString(),
      }));
    } catch (error) {
      console.error("Failed to update actor:", error);
      throw error;
    }
  }, []);

  const initializeAuth = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      await updateActor();
    } catch (error) {
      console.error("Failed to initialize auth:", error);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [updateActor]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async () => {
    try {
      if (!state.authClient) {
        throw new Error("Auth client not initialized");
      }

      await state.authClient.login({
        identityProvider,
        onSuccess: updateActor,
        onError: (error) => {
          console.error("Login failed:", error);
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (!state.authClient) {
        throw new Error("Auth client not initialized");
      }

      await state.authClient.logout();
      await updateActor();

      // Reset principal display
      setState((prev) => ({
        ...prev,
        principal: 'Click "Whoami" to see your principal ID',
      }));
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return {
    // State
    actor: state.actor,
    authClient: state.authClient,
    isAuthenticated: state.isAuthenticated,
    principal: state.principal,
    isLoading: state.isLoading,

    // Actions
    login,
    logout,
    updateActor,
  };
};
