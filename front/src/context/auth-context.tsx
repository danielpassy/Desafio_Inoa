import { createContext, useContext, useState } from 'react';

const AuthContext = createContext({
  user: {},
  login: (user: any): any => ({}),
  logout: (): any => ({}),
});

export const AuthContextProvider = (props: { children: any }) => {
  const [user, setUser] = useState(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  });

  const login = (user: any) => {
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser({});
  };
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
