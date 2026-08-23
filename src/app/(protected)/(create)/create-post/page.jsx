'use client';

import Link from 'next/link';
import CreatePostMain from '@/components/create-post/CreatePostMain';
import { Button } from '@/components/ui/button';
import { withAccessControl } from '@/hoc/withAccessControl';

function CreatePost({ hasAccess }) {
  if (!hasAccess) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <div>
          <h1 className='text-3xl font-semibold font-display text-center'>
            You don't have access to this module.
          </h1>
          <p className='text-sm text-gray-400 text-center mt-2'>
            Please contact your administrator to request access to this module.
          </p>
          <div className='flex items-center justify-center'>
            <Button variant={'primary'} asChild className={'mt-6'}>
              <Link href={'/dashboard'}>Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <CreatePostMain />;
}

export default withAccessControl(CreatePost);
