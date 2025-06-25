// AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

export const RoleList = [
  { type: 'admin', id: 1 },
  { type: 'technician', id: 2 },
  { type: 'scadmin', id: 3 },
  { type: 'patient', id: 4 },
  { type: 'doctor', id: 5},
  { type: 'radiologist', id: 6 },
  { type: 'scribe', id: 7},
  { type: 'codoctor', id: 8},
  { type: 'manager', id: 9}
] as const;

export type Role = (typeof RoleList)[number] | null;

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  console.log(role)

  useEffect(() => {
    const storedRoleID = localStorage.getItem('role');
    const storedRole = RoleList?.find((item) => item.id === Number(storedRoleID));
    if (storedRole) {
      setRoleState(storedRole);
    }
    setLoading(false);
  }, []);

  const setRole = (newRole: Role) => {
    if (newRole) {
      localStorage.setItem('role', newRole.id.toString());
    } else {
      localStorage.removeItem('role');
    }
    setRoleState(newRole);
  };

  return (
    <AuthContext.Provider value={{ role, setRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};