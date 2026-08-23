import { CreateCampaignFooter } from './footer';
import { CreateCampaignProvider, CreateCampaingForm } from './form';
import { CreateCampaignHeader } from './header';

export const CreateCampaignMain = () => {
  return (
    <div className='h-screen overflow-hidden flex flex-col'>
      <CreateCampaignHeader />
      <CreateCampaignProvider>
        <CreateCampaingForm />
        <CreateCampaignFooter />
      </CreateCampaignProvider>
    </div>
  );
};
