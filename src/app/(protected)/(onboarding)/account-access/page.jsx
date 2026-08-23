import { Suspense } from 'react';
import NewAccountAcess from '@/components/onboarding/NewAccountAccess';

const ConsoleAccess = () => {
  return (
    <Suspense>
      <NewAccountAcess />
    </Suspense>
  );
};

export default ConsoleAccess;
