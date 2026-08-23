import { Suspense } from 'react';
import { LocationDetailsMain } from '@/components/location-details/main-container';

const LocationDetailsPage = () => {
  return (
    <Suspense fallback={null}>
      <LocationDetailsMain />
    </Suspense>
  );
};

export default LocationDetailsPage;
