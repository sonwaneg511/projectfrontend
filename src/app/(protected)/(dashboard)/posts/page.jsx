/** biome-ignore-all lint/correctness/noUnusedImports: <> */
'use client';

import { format } from 'date-fns';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';
import { PlatformConnectionGate } from '@/components/common/PlatformConnectionGate';
import SkeletonLoader from '@/components/common/SkeletonLoader';
import FilterToolbar from '@/components/filter/FilterToolbar';
import PostCard from '@/components/posts/PostCard';
import InsightCard from '@/components/reviews/InsightCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/auth.context';
import { withAccessControl } from '@/hoc/withAccessControl';
import { usePostsData, usePostsGraphData } from '@/hooks/queries/posts';

const PostsPage = ({ hasAccess }) => {
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

  return <Posts />;
};

function Posts() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [platform, setPlatform] = useState('GMB');
  const [page, setPage] = useState(0);
  const { userDetails } = useAuth();
  const [range, setRange] = useState(() => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);

    return {
      from: lastMonth,
      to: today,
    };
  });

  const postListRef = useRef(null);

  const startDate = range.from ? format(range.from, 'yyyy-MM-dd') : '';

  const endDate = range.to ? format(range.to, 'yyyy-MM-dd') : '';

  // Filtering Logic Map
  const filterConfig = {
    all: () => true,
    'pending-deployment': (p) => p.status === 'submit',
    deployed: (p) => p.status === 'deployed',
  };

  const handleViewDetails = (postId) => {
    router.push(`/posts/${postId}?platform=${platform}`);
  };

  const {
    data: postData,
    isLoading: isLoadingPostData,
    error: errorPostData,
  } = usePostsData({
    client_id: userDetails?.clientId,
    user_id: userDetails?.user_id,
    start_date: startDate,
    end_date: endDate,
    platform: platform,
    status: '',
    page_no: page,
  });
  const {
    data: graphData,
    isLoading: isLoadingGraph,
    error: errorGraph,
  } = usePostsGraphData({
    client_id: userDetails?.clientId,
    user_id: userDetails?.user_id,
    start_date: startDate,
    end_date: endDate,
    platform: platform,
    status: '',
    page_no: page,
  });

  const finalpostData = postData?.post_data ?? [];

  const scrollToContainer = useCallback(() => {
    const container = postListRef.current;

    if (!container) return;

    container.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, []);

  const filteredPosts = useMemo(() => {
    const fn = filterConfig[activeTab];
    return finalpostData.filter(fn);
  }, [activeTab, filterConfig[activeTab], finalpostData]);

  return (
    <>
      <div className='px-6 py-5 shrink-0 bg-white border-b'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-semibold font-body text-gray-900'>
              Posts
            </h1>
            <p className='text-sm text-gray-600'>
              Manage your Google and Facebook Posts here
            </p>
          </div>
          <Button variant='primary' onClick={() => router.push('/create-post')}>
            <Plus color='var(--color-brand-300)' size={20} /> Create Post
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className='space-y-4 p-4 flex-1 overflow-y-auto'>
        <FilterToolbar
          platform={platform}
          onPlatformChange={setPlatform}
          filterPopup={false}
          dateRange={range}
          onDateRangeChange={(r) => {
            setRange(r);
          }}
        />

        <PlatformConnectionGate platform={platform} sectionName='posts'>
          {isLoadingPostData || isLoadingGraph ? (
            <SkeletonLoader variant='card' />
          ) : errorPostData || errorGraph ? (
            <p>Error loading posts</p>
          ) : (
            <>
              {/* Insight Cards */}
              <div className='grid grid-cols-12 gap-4'>
                <div className='col-span-4'>
                  <InsightCard
                    title='Total Posts'
                    value={graphData?.totalPosts}
                    growth='20%'
                  />
                </div>
                <div className='col-span-4'>
                  <InsightCard
                    title='Pending Posts'
                    value={graphData?.pendingPosts}
                    growth='12%'
                  />
                </div>
                <div className='col-span-4'>
                  <InsightCard
                    title='Deployed Posts'
                    value={graphData?.deployedPosts}
                    growth='15%'
                  />
                </div>
              </div>

              {/* Posts List */}
              <Card ref={postListRef} className='p-4 min-h-62'>
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  variant='secondary'
                >
                  <TabsList variant='secondary'>
                    <TabsTrigger
                      value='all'
                      variant='secondary'
                      position='first'
                    >
                      All
                    </TabsTrigger>
                    {/* <TabsTrigger
                      value='pending-approval'
                      variant='secondary'
                      position='middle'
                    >
                      Pending Approval
                    </TabsTrigger> */}
                    <TabsTrigger
                      value='pending-deployment'
                      variant='secondary'
                      position='middle'
                    >
                      Pending Deployment
                    </TabsTrigger>
                    <TabsTrigger
                      value='deployed'
                      variant='secondary'
                      position='last'
                    >
                      Deployed
                    </TabsTrigger>
                    {/* <TabsTrigger value='rejected' variant='secondary' position='last'>
                      Rejected
                    </TabsTrigger> */}
                  </TabsList>

                  <TabsContent value={activeTab}>
                    <div className='space-y-4 mt-4'>
                      {filteredPosts.length === 0 ? (
                        <div className='text-center text-lg text-gray-500 pt-12'>
                          No posts found
                        </div>
                      ) : (
                        filteredPosts.map((post) => (
                          <PostCard
                            key={post.post_id}
                            post={post}
                            onViewDetails={() =>
                              handleViewDetails(post.post_id)
                            }
                            platform={platform}
                          />
                        ))
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
                {filteredPosts.length === 0 ? null : (
                  <div className='border-t mt-2 p-4 flex items-center justify-between'>
                    <Button
                      variant='secondary'
                      disabled={page === 0}
                      onClick={() => {
                        setPage((p) => Math.max(p - 1, 0));
                        scrollToContainer();
                      }}
                    >
                      <ArrowLeft className='w-5 h-5' />
                      Previous
                    </Button>
                    <div className='flex gap-1 justify-center mt-4'>
                      {Array.from(
                        { length: postData?.total_no_of_pages ?? 0 },
                        (_, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setPage(i);
                              scrollToContainer();
                            }}
                            className={`px-3 py-1 rounded text-sm ${
                              page === i
                                ? 'bg-brand-600 text-white'
                                : 'text-gray-900'
                            }`}
                          >
                            {i + 1}
                          </button>
                        )
                      )}
                    </div>
                    <Button
                      variant='secondary'
                      disabled={page + 1 >= (postData?.total_no_of_pages ?? 1)}
                      onClick={() => {
                        setPage((p) => p + 1);
                        scrollToContainer();
                      }}
                    >
                      Next
                      <ArrowRight className='w-5 h-5' />
                    </Button>
                  </div>
                )}
              </Card>
            </>
          )}
        </PlatformConnectionGate>
      </div>
    </>
  );
}

export default withAccessControl(PostsPage);
