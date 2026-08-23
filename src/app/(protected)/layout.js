import { AuthProvider } from '@/context/auth.context';

const ProtectedLayout = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default ProtectedLayout;
