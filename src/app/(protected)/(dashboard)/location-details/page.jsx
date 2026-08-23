import { Suspense } from 'react';
import { getLocationDetails } from '@/components/location-details/constant';
import { LocationDetailsMain } from '@/components/location-details/main-container';

const LocationDetailsPage = async () => {
  const locationDetails = await getLocationDetails();

  return (
    <Suspense fallback={null}>
      <LocationDetailsMain locationDetails={locationDetails} />
    </Suspense>
  );
};

export default LocationDetailsPage;
