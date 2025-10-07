import { useState, useEffect } from "react";
import { UserService } from "@/lib/services";
import { User } from "@/lib/mockData";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await UserService.me();
      setUser(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { user, isLoading, loadUserData };
}
