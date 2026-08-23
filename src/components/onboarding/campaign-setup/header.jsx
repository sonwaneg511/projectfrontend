import Image from 'next/image';
import { Stepper } from '../Stepper';
import { TempLogo } from '@/assets/icons/templogo'

export const CampaignSetupHeader = () => {
  return (
    <header className='mt-2 mb-7 flex items-center justify-between'>
      {/* <Image src='/Logo.png' alt='Logo' width={139} height={32} /> */}
      <TempLogo width={130} height={28} />
      <Stepper currentStep={3} totalSteps={3} />
    </header>
  );
};
