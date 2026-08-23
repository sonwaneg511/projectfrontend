'use client';

import { ArrowRight, MessageSquareTextIcon, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import { ShareIcon } from '@/assets/icons/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate, formatString } from '@/lib/utils';
import { Badge } from '../ui/badge';

export default function PostCard({ post, onViewDetails, platform }) {
  let badgeVariant;

  switch (post.status) {
    case 'deployed': {
      badgeVariant = 'success';
      break;
    }
    case 'submit': {
      badgeVariant = 'warning';
      break;
    }
  }
  return (
    <Card className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
      <CardContent className='p-0'>
        <div className='flex'>
          {/* LEFT IMAGE */}
          {post.image && (
            <div className='relative min-w-80 bg-brand-100  overflow-hidden rounded-l-xl'>
              <Image
                src={post.image}
                alt={post.label}
                fill
                className='object-cover'
              />

              {/* FB Icon */}
              <div className='absolute bottom-3 left-3'>
                {/* <FacebookIcon className="w-6 h-6 text-blue-600" /> */}
              </div>
            </div>
          )}

          {/* RIGHT CONTENT */}
          <div className='flex-1 p-6 flex flex-col justify-between'>
            {/* Metrics */}
            {platform === 'FACEBOOK' && (
              <div className='flex items-center gap-2 text-gray-600 text-sm font-semibold'>
                <div className='flex items-center gap-1'>
                  <ThumbsUp size={20} className='text-gray-400' />
                  {post.likes}
                </div>

                <div className='flex items-center gap-1'>
                  <MessageSquareTextIcon size={20} className='text-gray-400' />
                  {post.comments}
                </div>

                <div className='flex items-center gap-1'>
                  <ShareIcon className='text-gray-500' />
                  {post.shares}
                </div>
              </div>
            )}

            {/* TITLE + DESCRIPTION */}
            <div className='my-3'>
              <h3 className='text-lg font-semibold text-gray-900 font-body'>
                {post.label}
              </h3>
              <p className='text-sm text-gray-600 leading-5 mt-1 line-clamp-3 whitespace-pre-line'>
                {post.description}
              </p>
            </div>

            <hr className='mt-2' />

            {/* FOOTER */}
            <div className='flex items-start justify-between mt-4 mb-2'>
              <div className='text-sm text-gray-600 space-y-1 flex gap-6'>
                <div className='flex flex-col'>
                  <span className='font-bold text-gray-900'>Dealer Id</span>
                  <span className='text-sm text-gray-600 font-normal'>
                    {post.dealers}
                  </span>
                </div>
                <div className='flex flex-col'>
                  <span className='font-bold text-gray-900'>Created on</span>
                  <span className='text-gray-600 font-normal text-sm'>
                    {formatDate(post.date)}
                  </span>
                </div>
                <div className='flex flex-col'>
                  <span className='font-bold text-gray-900'>Status</span>
                  <span className='text-gray-600 font-normal'>
                    <Badge variant={badgeVariant}>
                      {formatString(
                        post.status === 'submit' ? 'pending' : post.status
                      )}
                    </Badge>
                  </span>
                </div>
              </div>

              <Button
                variant='secondary'
                type='button'
                className='whitespace-nowrap'
                onClick={onViewDetails}
              >
                View Details <ArrowRight className='w-5 h-5 text-gray-400' />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
