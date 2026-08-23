import CoeSidebar from '@/components/(coe)/coe-sidebar';
import { CoeDashboardHeader } from './header';

const CoeDashboardLayout = ({ children }) => {
  return (
    <div className='h-screen flex'>
      <CoeSidebar />
      <div className='flex-1 h-full overflow-hidden'>
        <div className='flex flex-col h-full'>
          <CoeDashboardHeader />
          <div className='overflow-y-auto'>
            <div className='flex-1 p-4'>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoeDashboardLayout;
