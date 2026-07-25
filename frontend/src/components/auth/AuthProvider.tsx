"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/auth.store";
import { apiClient } from "@/lib/api/client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { token, setAuth, logout } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const fetchLatestProfile = async () => {
      if (!token) {
        setIsReady(true);
        return;
      }

      try {
        const res = await apiClient.get("/auth/me");
        // Update store with latest user data while preserving the token
        setAuth(token, res.data);
      } catch (error: any) {
        // If unauthorized or token expired, log out
        if (error.response?.status === 401 || error.response?.status === 403) {
          logout();
        }
        console.error("Failed to fetch latest profile", error);
      } finally {
        setIsReady(true);
      }
    };

    fetchLatestProfile();
  }, [token, setAuth, logout]);

  // Make sure we only render children on client to avoid hydration mismatches
  // But returning children directly is fine for this use case if we don't care about a minor flash.
  return <>{children}</>;
}
