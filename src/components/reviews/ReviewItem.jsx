'use client';

import { CornerDownLeft } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/auth.context';
import { useReplyComment } from '@/hooks/mutations/useReplyComment';
import { formatDate } from '@/lib/utils';
import StarPattern from '../stars/StarPattern';
import { Badge } from '../ui/badge';

export default function ReviewItem({ review, platform }) {
  // if (!review) return null;
  const [isReplying, setIsReplying] = useState(false);
  const [reply, setReply] = useState('');
  const { userDetails } = useAuth();
  const { mutate, isPending } = useReplyComment();

  const handleSubmit = () => {
    const payload = {
      client_id: userDetails?.clientId,
      user_id: userDetails?.user_id,
      review_id: review.review_id,
      review_comment: review.comment,
      reply_comment: reply,
      platform: platform,
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success('Comment Replied Successfully');
        setIsReplying(false);
        setReply('');
      },
      onError: (err) => {
        console.error(err, 'error');
        toast.error(err.message || 'Something went wrong , please try again');
      },
    });
  };

  const handleCancel = () => {
    setIsReplying(false);
    setReply('');
  };

  return (
    <Card className='bg-white'>
      <CardContent className='p-6'>
        <div className='flex gap-4'>
          <div className='flex-1'>
            {/* Header */}
            <div className='flex items-center justify-between'>
              <div className='font-bold text-xl text-gray-900'>
                {review?.reviewer_name}
              </div>
              <div className='text-sm text-muted-foreground'>
                Posted on: {formatDate(review?.posted_date)}
              </div>
            </div>

            {/* Rating */}
            <div className='text-md flex gap-4 py-2'>
              <span className='text-gray-600'>Rated</span>
              <StarPattern
                count={review?.rating}
                secondaryColor='text-gray-900'
              />
            </div>

            {/* Comment */}
            <div className='flex flex-col'>
              <div className='flex items-center gap-3 mt-2'>
                <span className='text-md text-gray-900 font-semibold'>
                  Comment:
                </span>
                {!review?.comment && (
                  <Badge variant={'warning'}>No Comment</Badge>
                )}
              </div>
              {review?.comment && (
                <p className='mt-2 text-sm text-gray-500 whitespace-pre-line'>
                  {review?.comment}
                </p>
              )}
            </div>

            {/* Reply Section */}
            <div className='my-4'>
              <div className='flex items-center justify-between'>
                {['reply_drafted', 'reply_deployed'].includes(
                  review?.reply_status
                ) && (
                  <p className='text-md text-gray-900 font-semibold'>
                    Replied:
                  </p>
                )}

                {review?.reply_status === 'no_reply' && (
                  <Button variant='primary' onClick={() => setIsReplying(true)}>
                    Reply
                  </Button>
                )}

                {review?.reply_status === 'reply_drafted' && (
                  <Badge variant='warning' className='mr-2'>
                    Reply Drafted
                  </Badge>
                )}
                {review?.reply_status === 'reply_deployed' && (
                  <Badge variant='success' className='mr-2'>
                    Reply Posted
                  </Badge>
                )}
              </div>

              {review?.reply_comment && (
                <p className='text-sm text-gray-500 mt-2 whitespace-pre-line'>
                  {review?.reply_comment}
                </p>
              )}

              {isReplying && (
                <div className='mt-4 space-y-3'>
                  <textarea
                    className='w-full border border-gray-300 rounded-lg py-3 px-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-600'
                    rows='5'
                    placeholder='Write your reply here...'
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                  />

                  <div className='flex gap-3'>
                    <Button
                      variant='primary'
                      onClick={handleSubmit}
                      disabled={!reply.trim() || isPending}
                    >
                      {isPending ? 'Submitting…' : 'Submit'}
                      <CornerDownLeft size={20} color='#97CDF9' />
                    </Button>
                    <Button variant='secondary' onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* separator */}
            <hr className='border-gray-200 my-3' />

            {/* Footer */}
            <div className='flex items-center justify-between gap-10 pt-2'>
              <div className='text-sm text-gray-600'>
                {review.store_name} - {review.store_address}
              </div>
              <span className='text-md font-bold text-gray-600 whitespace-nowrap'>
                Store ID: {review.dealer_id}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
