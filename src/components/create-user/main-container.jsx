import { CreateUserFooter } from './footer';
import { CreateUserForm, CreateUserProvider } from './form';
import { CreateUserHeader } from './header';

export const CreateUserMain = () => {
  return (
    <div className='h-screen overflow-hidden flex flex-col'>
      <CreateUserHeader />
      <CreateUserProvider>
        <CreateUserForm />
        <CreateUserFooter />
      </CreateUserProvider>
    </div>
  );
};
