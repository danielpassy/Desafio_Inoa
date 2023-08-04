import useAuthContext from '@/hooks/auth-context';
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthGuardMiddleware({
  children,
}: {
  children: ReactNode;
}) {
  const authContext = useAuthContext();
  const navigate = useNavigate();

  const hasPermission = () => {
    return authContext.user ? true : false;
  };

  useEffect(() => {
    if (!hasPermission()) {
      console.log('navigate to login');
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPermission]);

  return <>{hasPermission() ? children : null}</>;
}
