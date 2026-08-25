'use client';

import FilterToolbar from '@/components/filter/FilterToolbar';

export const ReviewsFilter = ({
  platform,
  onPlatformChange,
  onFilterChange,
  locationData,
  locationFilters,
  onLocationChange,
}) => {
  return (
    <FilterToolbar
      platform={platform}
      onPlatformChange={onPlatformChange}
      dateRangeFilter={false}
      onFilterChange={onFilterChange}
      locationData={locationData}
      locationFilters={locationFilters}
      onLocationChange={onLocationChange}
      showFacebookTab={false}
    />
  );
};
