import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth.context';
import {
  useDeployCoeCallAdsCampaign,
  useDeployCoePMaxCampaign,
  useDeployCoeSearchCampaign,
} from '@/hooks/mutations/coe';
import { mapZodErrors } from '@/lib/utils';
import {
  coeCampaignCallAdsSchema,
  coeCampaignPMaxSchema,
  coeCampaignSearchSchema,
} from './coe-campaign.schema';
import { generateCoeCampaignBody } from './constant';
import { useCoeCampaignDetails } from './form';

export const CoeCampaignDetailsFooter = () => {
  const { formData, campaignType, setValidationErrors } =
    useCoeCampaignDetails();
  const { userDetails } = useAuth();
  const { campaignId } = useParams();
  const router = useRouter();

  const { isPending: isSearchDeploying, mutateAsync: deploySearchCampaign } =
    useDeployCoeSearchCampaign();
  const { isPending: isCallAdsDeploying, mutateAsync: deployCallAdsCmapaign } =
    useDeployCoeCallAdsCampaign();
  const { isPending: isPMaxDeploying, mutateAsync: deployPMaxCampaign } =
    useDeployCoePMaxCampaign();

  const validateForm = () => {
    const payload = { ...formData };
    delete payload.headlines;
    delete payload.descriptions;

    let result;

    switch (campaignType) {
      case 'Search campaign': {
        result = coeCampaignSearchSchema.safeParse(payload);
        break;
      }

      case 'Call ad campaign': {
        result = coeCampaignCallAdsSchema.safeParse(payload);
        break;
      }

      case 'Pmax campaign': {
        delete payload.longHeadlines;
        delete payload.adName;

        result = coeCampaignPMaxSchema.safeParse(payload);
        break;
      }
    }

    return result;
  };

  const handleDeploy = async () => {
    const result = validateForm();

    if (result.success) {
      const payload = result.data;
      payload.clientId = userDetails?.clientId;
      payload.campaignId = campaignId;

      const body = generateCoeCampaignBody(payload, campaignType);

      try {
        switch (campaignType) {
          case 'Search campaign': {
            await deploySearchCampaign(body);
            router.replace('/coe/campaigns');
            toast.success('Campaign deploy successfully.');
            break;
          }

          case 'Call ad campaign': {
            await deployCallAdsCmapaign(body);
            router.replace('/coe/campaigns');
            toast.success('Campaign deploy successfully.');
            break;
          }

          case 'Pmax campaign': {
            await deployPMaxCampaign(body);
            router.replace('/coe/campaigns');
            toast.success('Campaign deploy successfully.');
            break;
          }
        }
      } catch (error) {
        console.log('error', error);
      }
    } else {
      const errors = mapZodErrors(result.error.issues);

      setValidationErrors((prevErrors) => ({ ...prevErrors, ...errors }));
      toast.error('Invalid form details.');
    }
  };

  return (
    <div className='py-4 px-10 flex items-center justify-end gap-3 bg-white border-t shrink-0'>
      <Button variant={'outline'} asChild>
        <Link href={'/coe/campaigns'}>Cancel</Link>
      </Button>
      <Button
        disabled={isSearchDeploying || isCallAdsDeploying || isPMaxDeploying}
        variant={'primary'}
        className={'min-w-30'}
        onClick={handleDeploy}
      >
        Deploy
      </Button>
    </div>
  );
};
