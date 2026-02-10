import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import AppRoutes from '../../helpers/AppRoutes';

const AuthRedirector = ({ children }) => {
  const { userDetails } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!userDetails) {
      router.push(AppRoutes.login);
    }
  }, [userDetails]);

  return <>{children}</>;
};

export default AuthRedirector;