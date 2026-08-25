'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Moon, PanelRightIcon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
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
} from '@/assets/icons/icons.jsx';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuth } from '@/context/auth.context';
import { useLogout } from '@/hooks/mutations/auth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Loader } from '@/components/ui/loader';

const mainMenu = [
  { label: 'Dashboard', icon: DashboardIcon, href: '/dashboard' },
  { label: 'Campaigns', icon: CampaignIcon, href: '/campaigns' },
  { label: 'Reviews', icon: ReviewsIcon, href: '/reviews' },
  { label: 'Posts', icon: PostsIcon, href: '/posts' },
  { label: 'Locations', icon: LocationIcon, href: '/locations' },
  { label: 'Reports', icon: ReportIcon, href: '/reports' },
];

const otherMenu = [
  { label: 'Settings', icon: SettingsIcon, href: '/settings' },
  { label: 'Users', icon: UsersIcon, href: '/users' },
];

export function AppSidebar() {
  const { userDetails } = useAuth();
  const { isPending, mutateAsync } = useLogout();
  const router = useRouter();

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
      toast.error('Logout failed', { description: message });
    }
  };

  return (
    <Sidebar variant='inset' collapsible='icon'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size='lg' tooltip='Optimo'>
              <Link href='/dashboard' className='flex items-center gap-2'>
                <Image
                  src='/optimo-icon.svg'
                  alt='icon'
                  width={30}
                  height={30}
                  className='shrink-0'
                />
                <span className='text-lg font-semibold group-data-[collapsible=icon]:hidden'>Optimo</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>GENERAL</SidebarGroupLabel>
          <SidebarMenu>
            {mainMenu.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Other Links</SidebarGroupLabel>
          <SidebarMenu>
            {filteredOtherMenus.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarThemeToggle />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size='lg' tooltip={userDetails?.user_id}>
                  <div className='flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full'>
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${userDetails?.user_id}`}
                      alt='User Avatar'
                      className='h-8 w-8 rounded-full'
                    />
                  </div>
                  <div className='min-w-0 flex-1 group-data-[collapsible=icon]:hidden'>
                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className='truncate text-sm font-medium'>
                            {userDetails?.user_id || '-'}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent side='right'>
                          <span className='text-sm'>{userDetails?.user_id}</span>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className='text-muted-foreground truncate text-xs'>
                            {userDetails?.email}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent side='right'>
                          <span className='text-sm'>{userDetails?.email}</span>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <ProfileChevron className='ml-auto h-4 w-4 shrink-0 group-data-[collapsible=icon]:hidden' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side='top' align='start' className='w-48'>
                <DropdownMenuItem asChild>
                  <Button
                    variant='destructive'
                    className='h-8 w-full shadow-none'
                    onClick={handleLogout}
                  >
                    {isPending && <Loader />}
                    {isPending ? 'Logging out...' : 'Logout'}
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function SidebarThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  if (isCollapsed) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip='Toggle theme'
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className='gap-3 [&_svg]:size-5'
          >
            {theme === 'dark' ? (
              <Moon className='shrink-0' />
            ) : (
              <Sun className='shrink-0' />
            )}
            <span className='group-data-[collapsible=icon]:hidden'>Theme</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <div className='px-2 py-1'>
      <div className='bg-muted flex rounded-lg p-1'>
        <button
          onClick={() => setTheme('light')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all',
            theme === 'light'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Sun className='h-3.5 w-3.5' />
          Light
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all',
            theme === 'dark'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Moon className='h-3.5 w-3.5' />
          Dark
        </button>
      </div>
    </div>
  );
}

export function SidebarToggleBtn({ className, ...props }) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button variant='ghost' size='icon' onClick={toggleSidebar} className={className} {...props}>
      <PanelRightIcon className='h-4 w-4' />
    </Button>
  );
}
function NavItem({ icon: Icon, href, label }) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <SidebarMenuItem>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              tooltip={label}          // ← shadcn uses this for built-in tooltip in icon mode
              className='gap-3 text-sm [&_svg]:size-5'
            >
              <Link href={href}>
                <Icon
                  className={cn(
                    'h-5 w-5 shrink-0',
                    isActive ? 'text-white' : 'text-gray-400'
                  )}
                />
                <span className='group-data-[collapsible=icon]:hidden'>{label}</span>
              </Link>
            </SidebarMenuButton>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side='right'>{label}</TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </SidebarMenuItem>
  );
}