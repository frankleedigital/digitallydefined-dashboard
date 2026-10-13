// Hook into AuthContext so we store the user ID for workspace foldering
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export function usePuterUserId() {
  const { currentUser } = useAuth();
  useEffect(() => {
    if (currentUser?.id) {
      localStorage.setItem("dd_supabase_user_id", currentUser.id);
    }
  }, [currentUser?.id]);
}
