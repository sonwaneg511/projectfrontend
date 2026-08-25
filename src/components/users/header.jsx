import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

export const UsersHeader = () => {
  return (
    <div className='px-6 py-5 bg-white border-b border-border flex items-center justify-between shrink-0'>
      <div>
        <h1 className='text-2xl font-semibold font-body text-gray-900'>
          Users
        </h1>
        <p className='text-sm text-gray-600'>
          Manage your team members and their account permissions here
        </p>
      </div>
      <Button variant={'primary'} asChild>
        <Link href={'/create-user?from=users'}>
          <PlusIcon className='text-brand-300' size={20} />
          <span>Add User</span>
        </Link>
      </Button>
    </div>
  );
};
