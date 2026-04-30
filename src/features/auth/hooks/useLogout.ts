import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutApi } from "../api/auth.api";
import { useAuth } from "../../../shared/auth/AuthContext";
import { clearStoredPendingConfirmationEmail } from "../../../infrastructure/auth/auth-storage";

export function useLogout() {
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  return useMutation({
    mutationKey: ["auth", "logout"],
    mutationFn: async () => {
      try {
        await logoutApi();
      } finally {
        clearStoredPendingConfirmationEmail();
        await queryClient.cancelQueries();
        logout();
      }
    },
    retry: 0,
  });
}
