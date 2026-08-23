import { Suspense } from 'react';
import { VerifyEmailForm } from '@/components/(auth)/verify-email-form';

const VerifyEmailPage = () => {
  return (
    <Suspense fallback={null}>
      <VerifyEmailForm />
    </Suspense>
  );
};

export default VerifyEmailPage;
