'use client';
// import { MessageSquareTextIcon, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
// import { ShareIcon } from '@/assets/icons/icons';
import DetailsAccordionCard from '@/components/common/AccordianCard';
import AppBreadcrumb from '@/components/common/BreadCrumb';
import { PostLoactionDataTable } from '@/components/posts/data-table';
import { useAuth } from '@/context/auth.context';
import { withAccessControl } from '@/hoc/withAccessControl';
import { usePostsDetails } from '@/hooks/queries/posts';
import { formatDate } from '@/lib/utils';

const PostDetailsPage = ({ hasAccess }) => {
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

  return (
    <Suspense fallback={null}>
      <ViewPostDetails />
    </Suspense>
  );
};

const ViewPostDetails = () => {
  const { userDetails } = useAuth();
  const withValue = (items) =>
    items.filter(
      (item) =>
        item.value !== null &&
        item.value !== undefined &&
        item.value !== '' &&
        !(Array.isArray(item.value) && item.value.length === 0)
    );

  const params = useParams();
  const searchParams = useSearchParams();
  const postId = params.post_id;
  const platform = searchParams.get('platform') ?? 'FACEBOOK';

  const { data: postDetails, isLoading } = usePostsDetails({
    client_id: userDetails?.clientId,
    user_id: userDetails?.user_id,
    post_id: postId,
    platform: platform,
  });

  if (isLoading) return <p>Loading...</p>;
  if (!postDetails) return <p>No post found</p>;

  return (
    <>
      <div className='px-6 py-5 shrink-0 bg-white border-b'>
        <AppBreadcrumb type='posts' name={postDetails.label} />
        <div className='flex pt-4 justify-between items-baseline'>
          <div className='max-w-132'>
            <h2 className='text-body text-lg font-semibold text-gray-900'>
              {postDetails.label}
            </h2>
            <p className='text-sm text-gray-600 truncate'>
              {postDetails.summary}
            </p>
          </div>
          {/* <div className='flex items-center gap-2 text-gray-600 text-sm font-semibold'>
            <div className='flex items-center gap-1'>
              <ThumbsUp size={20} className='text-gray-400' />
              {14}
            </div>

            <div className='flex items-center gap-1'>
              <MessageSquareTextIcon size={20} className='text-gray-400' />
              {39}
            </div>

            <div className='flex items-center gap-1'>
              <ShareIcon className='text-gray-500' />
              {10}
            </div>
          </div> */}
        </div>
      </div>
      <div className='p-4 flex flex-col gap-4 bg-gray-50 flex-1 overflow-y-auto'>
        <DetailsAccordionCard
          title='Overview'
          items={withValue([
            { label: 'Publishing to', value: platform },
            { label: 'Post Type', value: postDetails.post_type },
            { label: 'Post ID', value: postDetails.post_id },
            { label: 'Created by', value: postDetails.created_by },
            {
              label: 'Created on',
              value: formatDate(postDetails.created_date),
            },
            {
              label: 'Post Label',
              value: postDetails.label,
            },
          ])}
        />
        <DetailsAccordionCard
          title='Creative'
          items={withValue([
            {
              label: 'Post Text',
              value: postDetails.summary,
            },
            { label: 'Action Type', value: postDetails.action_type },
            {
              label: 'Action Type URL',
              value: postDetails.action_url,
            },
            { label: 'Coupon Code', value: postDetails.coupon_code },
            {
              label: 'Offer Redemption Link',
              value: postDetails.redeem_url,
            },
            {
              label: 'Terms and Conditions',
              value: postDetails.terms_conditions,
            },
            {
              label: 'Post Image',
              value: postDetails.image_url ? (
                <Image
                  src={postDetails.image_url}
                  alt='Post Image'
                  width={360}
                  height={130}
                  className='rounded-md object-cover'
                  style={{
                    height: '120px',
                    width: '320px',
                    objectFit: 'cover',
                  }}
                />
              ) : null,
            },
          ])}
        />
        <DetailsAccordionCard title='Locations'>
          <PostLoactionDataTable data={postDetails.post_location_details} />
        </DetailsAccordionCard>
      </div>
    </>
  );
};

export default withAccessControl(PostDetailsPage);
