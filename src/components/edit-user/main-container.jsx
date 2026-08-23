import { EditUserFooter } from './footer';
import { EditUserForm, EditUserProvider } from './form';
import { EditUserHeader } from './header';

export const EditUserMain = () => {
  return (
    <div className='h-screen overflow-hidden flex flex-col'>
      <EditUserHeader />
      <EditUserProvider>
        <EditUserForm />
        <EditUserFooter />
      </EditUserProvider>
    </div>
  );
};
