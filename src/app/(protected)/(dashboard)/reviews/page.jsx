'use client';

import { ReviewsMain } from '@/components/reviews/main-container';
import { withAccessControl } from '@/hoc/withAccessControl';

function ReviewsPage({ hasAccess }) {
  if (!hasAccess) {
    return (
      <div className='size-full flex items-center justify-center'>
        <div>
          <h1 className='text-3xl font-semibold font-display text-center'>
            You don't have access to this module.
          </h1>
          <p className='text-sm text-gray-400 text-center mt-2'>
            Please contact your administrator to request access to this module.
          </p>
        </div>
      </div>
    );
  }

  return <ReviewsMain />;
}

export default withAccessControl(ReviewsPage);
