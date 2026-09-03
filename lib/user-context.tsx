"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { CurrentUser, UserRole } from "@/lib/types";

type UserContextType = {
  user: CurrentUser;
  setRole: (role: UserRole) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser>({
    id: "u1",
    name: "You",
    role: "owner",
  });

  function setRole(role: UserRole) {
    setUser((prev) => ({ ...prev, role }));
  }

  return (
    <UserContext.Provider value={{ user, setRole }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}