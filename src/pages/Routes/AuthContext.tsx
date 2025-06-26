// AuthContext.tsx
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const RoleList = [
  { type: 'admin', id: 1 },
  { type: 'technician', id: 2 },
  { type: 'scadmin', id: 3 },
  { type: 'patient', id: 4 },
  { type: 'doctor', id: 5 },
  { type: 'radiologist', id: 6 },
  { type: 'scribe', id: 7 },
  { type: 'codoctor', id: 8 },
  { type: 'manager', id: 9 },
] as const;

export type Role = (typeof RoleList)[number] | null;

// ✅ API Response interface
export interface UserProfile {
  refUserId: number;
  refUserFirstName: string;
  refUserLastName: string;
  refUserCustId: string;
  refRTId: number;
  refSCId: number;
  refCODOEmail: string;
}

// ✅ Context Type
interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  loading: boolean;
  refreshToken: () => Promise<void>; // <-- Add this
}

// ✅ Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const setRole = (newRole: Role) => {
    if (newRole) {
      localStorage.setItem('role', newRole.id.toString());
    } else {
      localStorage.removeItem('role');
    }
    setRoleState(newRole);
  };

  const refreshToken = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL_USERSERVICE}/profile/user/`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res);

      if (
        res.data.error == "Invalid token" ||
        res.data.error == "Missing token"
      ) {
        localStorage.clear();
        navigate("/");
      } else {
        const profile: UserProfile = res.data.data.data;
        setUser(profile);
        localStorage.setItem("token", res.data.token);
        
        const matchedRole =
          RoleList.find((r) => r.id === profile.refRTId) || null;
        setRole(matchedRole);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedRoleID = localStorage.getItem('role');
    const storedRole = RoleList.find((item) => item.id === Number(storedRoleID)) || null;
    setRole(storedRole);
    refreshToken(); // This will override storedRole with actual API response
  }, []);

  return (
    <AuthContext.Provider value={{ role, setRole, user, setUser, loading, refreshToken  }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook to consume context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};