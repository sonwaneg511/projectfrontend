import { Suspense } from 'react';
import { MicrositeDetailsMain } from '@/components/microsites/details/main-container';

const MicrositeDetailsPage = () => {
  return (
    <Suspense fallback={null}>
      <MicrositeDetailsMain />
    </Suspense>
  );
};

export default MicrositeDetailsPage;
