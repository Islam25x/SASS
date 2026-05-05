import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../api/user.api";

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}