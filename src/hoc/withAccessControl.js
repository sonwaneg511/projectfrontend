import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth.context';
import { hasAccess } from '@/lib/utils';

export const withAccessControl = (WrappedComponent) => {
  return function EnhancedComponent(props) {
    const { userDetails } = useAuth();
    const pathname = usePathname();
    const userHasAccess = hasAccess(pathname, userDetails?.modules);

    return <WrappedComponent {...props} hasAccess={userHasAccess} />;
  };
};
