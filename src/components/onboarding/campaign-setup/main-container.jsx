import { CampaignSetupFooter } from './footer';
import { CampaignSetupForm } from './form';
import { CampaignSetupHeader } from './header';
import { CampaignSetupProvider } from './provider';

export const CampaignSetupMain = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <CampaignSetupProvider>
        <div className='max-w-7xl w-full mx-auto px-4 pb-8 pt-4 sm:px-6 lg:px-8'>
          <CampaignSetupHeader />
          <CampaignSetupForm />
        </div>
        <CampaignSetupFooter />
      </CampaignSetupProvider>
    </div>
  );
};
