import Sidebar from '@/components/Sidebar';

export default function LayoutShell({ children }) {
  return (
    <div className='flex h-screen overflow-hidden'>
      <Sidebar />
      <main className='flex-1 overflow-hidden flex flex-col'>{children}</main>
    </div>
  );
}
