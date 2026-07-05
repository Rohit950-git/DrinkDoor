import { useAppDispatch, useAppSelector } from "@/src/store";
import {
  setCredentials,
  clearCredentials,
  setError,
  setLoading,
} from "@/src/store/authSlice";
import {
  useLoginMutation,
  useLogoutMutation,
  useLazyProfileQuery,
} from "@/src/services/authApi";
import { UserRole } from "../types";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { LoginDto } from "../type";

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated, loading, error } = useAppSelector(
    (state) => state.auth
  );

  const [loginTrigger, { isLoading: isLoginLoading }] = useLoginMutation();
  const [logoutTrigger, { isLoading: isLogoutLoading }] = useLogoutMutation();
  const [fetchProfileTrigger] = useLazyProfileQuery();

  const getDashboardRedirect = useCallback((role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "/admin/dashboard";
      case UserRole.DISTRIBUTOR:
        return "/distributor/dashboard";
      case UserRole.SHOPKEEPER:
      default:
        return "/shopkeeper/dashboard";
    }
  }, []);

  const login = async (credentials: LoginDto) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const result = await loginTrigger(credentials).unwrap();
      if (result.success && result.user) {
        dispatch(setCredentials(result.user));
        const redirectUrl = getDashboardRedirect(result.user.role);
        router.push(redirectUrl);
        return { success: true };
      }
      return { success: false, error: "Login failed" };
    } catch (err: any) {
      const errMsg = err?.data?.message || err?.message || "Invalid credentials";
      dispatch(setError(errMsg));
      return { success: false, error: errMsg };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logout = async () => {
    dispatch(setLoading(true));
    try {
      await logoutTrigger().unwrap();
    } catch (err) {
      console.error("Failed to call logout api", err);
    } finally {
      dispatch(clearCredentials());
      router.push("/login");
    }
  };

  const refreshProfile = async () => {
    dispatch(setLoading(true));
    try {
      const result = await fetchProfileTrigger().unwrap();
      if (result.success && result.data) {
        dispatch(setCredentials(result.data));
        return result.data;
      } else {
        dispatch(clearCredentials());
        return null;
      }
    } catch (err) {
      dispatch(clearCredentials());
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    user,
    isAuthenticated,
    loading: loading || isLoginLoading || isLogoutLoading,
    error,
    login,
    logout,
    refreshProfile,
    getDashboardRedirect,
  };
}
