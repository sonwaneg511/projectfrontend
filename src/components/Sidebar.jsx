'use client';

// import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  CampaignIcon,
  DashboardIcon,
  LocationIcon,
  PostsIcon,
  ProfileChevron,
  ReportIcon,
  ReviewsIcon,
  SettingsIcon,
  UsersIcon,
  MicrositesIcon
} from '@/assets/icons/icons.jsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuth } from '@/context/auth.context';
import { useLogout } from '@/hooks/mutations/auth';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Loader } from './ui/loader';
import { TempLogo } from '@/assets/icons/templogo'

const mainMenu = [
  { label: 'Dashboard', icon: DashboardIcon, href: '/dashboard' },
  { label: 'Campaigns', icon: CampaignIcon, href: '/campaigns' },
  { label: 'Reviews', icon: ReviewsIcon, href: '/reviews' },
  { label: 'Posts', icon: PostsIcon, href: '/posts' },
  { label: 'Locations', icon: LocationIcon, href: '/locations' },
  { label: 'Microsites', icon: MicrositesIcon, href: '/microsites' },
  { label: 'Reports', icon: ReportIcon, href: '/reports' },
];

const otherMenu = [
  { label: 'Settings', icon: SettingsIcon, href: '/settings' },
  { label: 'Users', icon: UsersIcon, href: '/users' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { userDetails } = useAuth();

  const { isPending, mutateAsync } = useLogout();

  const filteredOtherMenus = otherMenu.filter((menu) => {
    if (menu.href === '/users') {
      return (
        userDetails?.role === 'ADMIN' || userDetails?.role === 'SUPER_ADMIN'
      );
    }

    return true;
  });

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
    <aside className='w-60 h-screen bg-black flex flex-col'>
      {/* Brand Section */}
      {/* <Image
        src='/Logo.png'
        alt='Logo'
        width={139}
        height={32}
        className=' m-5'
        priority={true}
      /> */}
      <TempLogo width={139} height={32} className='m-2' variant='white' />

      {/* Main Navigation */}
      <nav className='flex-1 overflow-y-auto py-3 px-4'>
        <p className='text-xs mb-2 fw-bold text-white/50'>GENERAL</p>

        <div className='space-y-1'>
          {mainMenu.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className={cn(
                  'flex items-center font-medium gap-2.5 px-3 py-2 rounded-md text-sm transition-colors duration-300 text-white border border-transparent',
                  isActive
                    ? 'bg-brand-600 border-white/20'
                    : 'hover:bg-brand-200/10 text-white/90'
                )}
              >
                <item.icon
                  className={cn(
                    'w-5 h-5',
                    isActive ? 'text-white' : 'text-white/60'
                  )}
                />

                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className='px-3 py-4'>
        <p className='text-xs mb-2 fw-bold text-white/50'>Other Links</p>

        <div className='space-y-1'>
          {filteredOtherMenus.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className={cn(
                  'flex items-center fw-semibold gap-2.5 px-3 py-2 rounded-md text-sm transition-all text-white',
                  isActive
                    ? 'bg-white/15 font-medium border border-white/20'
                    : 'hover:bg-white/10 text-white/80'
                )}
              >
                <item.icon
                  className={cn(
                    'w-5 h-5',
                    isActive ? 'text-white' : 'text-white/60'
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className='mb-5 mx-4 p-3 border border-white/15 hover:bg-white/5 rounded-2xl flex items-center gap-2 justify-between cursor-pointer'>
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
                      <p className='text-sm font-medium text-white truncate max-w-25 cursor-default'>
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
                      <p className='text-xs text-white/50 truncate max-w-25 cursor-default'>
                        {userDetails?.email}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent side='right'>
                      <span className='text-sm'>{userDetails?.email}</span>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>

              <ProfileChevron className={cn('w-5 h-5 text-white/70')} />
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
