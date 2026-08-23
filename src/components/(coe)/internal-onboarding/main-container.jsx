import { InternalOnboardingFooter } from './footer';
import { InternalOnboardingForm, InternalOnboardingProvider } from './form';
import { InternalOnboardingHeader } from './header';

export const InternalOnboardingMain = () => {
  return (
    <div className='h-screen overflow-hidden flex flex-col'>
      <InternalOnboardingHeader />
      <InternalOnboardingProvider>
        <InternalOnboardingForm />
        <InternalOnboardingFooter />
      </InternalOnboardingProvider>
    </div>
  );
};
