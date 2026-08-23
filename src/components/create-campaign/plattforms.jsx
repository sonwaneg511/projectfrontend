import { SegmentedRadioGroup } from '@/components/common/SegmentedRadioGroup';
import { PLATFORMS } from '@/constants/constants';
import { cn } from '@/lib/utils';
import { LabelInputContainer, labelVariants } from '../ui/label';
import {
  CreateCampaignFormCallAds,
  CreateCampaignFormCallAdsErrors,
  CreateCampaignFormDemandGenMultiAsset,
  CreateCampaignFormDemandGenMultiAssetErrors,
  CreateCampaignFormPmax,
  CreateCampaignFormPmaxErrors,
  CreateCampaignFormSearch,
  CreateCampaignFormSearchErrors,
} from './constants';
import { useCreateCampaign } from './form';

export const CreateCampaignPlatforms = () => {
  const {
    campaignType,
    setCampaignType,
    setFormData,
    setValidationErrors,
    formData,
  } = useCreateCampaign();

  const handlePlatformSelection = (value) => {
    setCampaignType(value);

    let formState;
    let errorState;

    switch (value) {
      case 'search': {
        formState = new CreateCampaignFormSearch(formData);
        errorState = new CreateCampaignFormSearchErrors();
        break;
      }

      case 'pMax': {
        formState = new CreateCampaignFormPmax(formData);
        errorState = new CreateCampaignFormPmaxErrors();
        break;
      }

      case 'callAds': {
        formState = new CreateCampaignFormCallAds(formData);
        errorState = new CreateCampaignFormCallAdsErrors();
        break;
      }

      case 'demandGenMultiAsset': {
        formState = new CreateCampaignFormDemandGenMultiAsset(formData);
        errorState = new CreateCampaignFormDemandGenMultiAssetErrors();
        break;
      }

      default:
        formState = new CreateCampaignFormSearch(formData);
        errorState = new CreateCampaignFormPmaxErrors();
    }

    setFormData(formState);
    setValidationErrors(errorState);
  };

  const handleImport = (e) => {
    const { dataset } = e.target;

    switch (dataset.value) {
      case 'pMax': {
        import('./pmax-form');
        break;
      }

      case 'callAds': {
        import('./call-ads-form');
        break;
      }

      case 'demandGenMultiAsset': {
        import('./demand-gen-multi-asset');
        break;
      }
    }
  };

  return (
    <LabelInputContainer>
      <p className={cn(labelVariants())}>Platform</p>
      <SegmentedRadioGroup
        // className={'grid grid-cols-2 gap-4'}
        value={campaignType}
        onChange={handlePlatformSelection}
        options={PLATFORMS}
        onMouseEnter={handleImport}
        onFocus={handleImport}
      />
    </LabelInputContainer>
  );
};
