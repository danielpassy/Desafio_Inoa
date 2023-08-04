import { createContext, useContext, useState } from 'react';

export const AuthContextProvider = (props: { children: any }) => {
  const [user, setUser] = useState(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  });

  return (
    <AuthContext.Provider
      value={{ user: user, setUser: setUser, logout: () => setUser(null) }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

const AuthContext = createContext({
  user: null,
  setUser: (user: any): any => ({}),
  logout: (): any => ({}),
});

const useAuthContext = () => {
  return useContext(AuthContext);
};
export default useAuthContext;
