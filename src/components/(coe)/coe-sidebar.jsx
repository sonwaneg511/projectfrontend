'use client';

import { UserIcon } from 'lucide-react';
// import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { CampaignIcon, ProfileChevron } from '@/assets/icons/icons';
import { useAuth } from '@/context/auth.context';
import { useLogout } from '@/hooks/mutations/auth';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { TempLogo } from '@/assets/icons/templogo'

const mainMenu = [
  {
    label: 'Campaigns',
    icon: CampaignIcon,
    href: '/coe/campaigns',
  },
  {
    label: 'Internal Onboarding',
    icon: UserIcon,
    href: '/coe/internal-onboarding',
  },
];

export default function CoeSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { userDetails } = useAuth();

  const { isPending, mutateAsync } = useLogout();

  const handleLogout = async () => {
    try {
      await mutateAsync();
      toast('User logout successfully.');
      router.replace('/login');
    } catch (error) {
      const message = error?.data?.message || 'Something went wrong.';

      toast.error('Logout failed', {
        description: message,
      });
    }
  };

  return (
    <aside className='w-60 h-screen bg-white border-r flex flex-col'>
      {/* Brand Section */}
      {/* <Image
        src='/Logo.png'
        alt='Logo'
        width={139}
        height={32}
        className=' m-5'
        priority
      /> */}
      <TempLogo width={119} height={28} className='m-2' />

      {/* Main Navigation */}
      <nav className='flex-1 overflow-y-auto py-3 px-4'>
        <p className='text-xs mb-2 fw-bold text-gray-500'>GENERAL</p>

        <div className='space-y-1'>
          {mainMenu.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className={cn(
                  'flex items-center font-medium gap-2.5 px-3 py-2 rounded-md text-sm transition-all text-[#414651] border border-transparent',
                  isActive
                    ? 'bg-[#F0F7FE] border-[#C2E0FB] text-[#2D75E3]'
                    : ' hover:bg-[#F0F7FE] text-[#414651]'
                )}
              >
                <item.icon
                  className={cn(
                    'w-5 h-5',
                    isActive ? 'text-brand-600' : 'text-[#A4A7AE]'
                  )}
                />

                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className='mb-5 mx-4 p-3 border rounded-2xl flex items-center gap-2 justify-between cursor-pointer'>
            <div className='w-10 h-10 rounded-full overflow-hidden flex items-center justify-center'>
              {/** biome-ignore lint/performance/noImgElement: <> */}
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${userDetails?.user_id}`}
                alt='User Avatar'
                width={40}
                height={40}
                className='w-8 h-8 rounded-full'
              />
            </div>

            <div className='flex w-full justify-around'>
              <TooltipProvider delayDuration={200}>
                <div className='space-y-0.5'>
                  {/* User ID */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className='text-sm font-medium truncate max-w-25 cursor-default'>
                        {userDetails?.user_id || '-'}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent side='right'>
                      <span className='text-sm'>{userDetails?.user_id}</span>
                    </TooltipContent>
                  </Tooltip>

                  {/* Email */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className='text-xs text-muted-foreground truncate max-w-25 cursor-default'>
                        {userDetails?.email}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent side='right'>
                      <span className='text-sm'>{userDetails?.email}</span>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>

              <ProfileChevron className={cn('w-5 h-5')} />
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Button
              variant={'destrucite'}
              className={'w-full h-8 shadow-none'}
              onClick={handleLogout}
            >
              {isPending && <Loader />}
              {isPending ? 'Logging out...' : 'Logout'}
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </aside>
  );
}
