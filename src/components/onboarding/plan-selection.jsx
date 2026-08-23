'use client';

import { CreditCard, Info, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { plans } from '@/constants/constants';
import { useGetAllPlans } from '@/hooks/queries/onboarding';
import { CreateCampaignPaymentSummary } from '../create-campaign/payment-summary';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Stepper } from './Stepper';
import { TempLogo } from '@/assets/icons/templogo'

export default function PricingModel() {
  const [locations, setLocations] = useState(5);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState(null);
  const [pricePreviewData, setPricePreviewData] = useState(null);
  const { data: plansData, isLoading } = useGetAllPlans();
  // const defaultSelectedServices = plansData?.map((s) => s.serviceKey) || [];
  const [selectedServices, setSelectedServices] = useState({});
  const handleDecrement = () => {
    if (locations > 1) {
      setLocations(locations - 1);
    }
  };

  const handleIncrement = () => {
    if (locations < 10) {
      setLocations(locations + 1);
    }
  };
  const postPayment = async (body) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/plan/price-preview`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json(); // parse response body

      // now you can use in frontend
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const calculateTotal = (plan) => {
    if (!plansData) return 0;

    const selected = selectedServices[plan.id] || [];

    const subtotal = selected.reduce((sum, serviceKey) => {
      const service = plansData.find((s) => s.serviceKey === serviceKey);

      if (!service) return sum;

      const servicePrice = service[plan.priceKey]; // monthly / halfYearly / yearly

      return sum + servicePrice;
    }, 0);

    return subtotal * locations * plan.billingMultiplier;
  };
  const calculatePerMonthPrice = (plan) => {
    const selected = selectedServices[plan.id] || [];

    const monthlySubtotal = selected.reduce((sum, serviceKey) => {
      const service = plansData.find((s) => s.serviceKey === serviceKey);
      if (!service) return sum;

      return sum + service[plan.priceKey];
    }, 0);

    return monthlySubtotal * locations;
  };

  const toggleService = (planId, serviceKey) => {
    setSelectedServices((prev) => {
      const current = prev[planId] || [];

      return {
        ...prev,
        [planId]: current.includes(serviceKey)
          ? current.filter((key) => {
              if (serviceKey === 'AI' || serviceKey === 'CAMPAIGNS') {
                return key !== 'AI' && key !== 'CAMPAIGNS';
              } else {
                return key !== serviceKey;
              }
            })
          : serviceKey === 'AI' || serviceKey === 'CAMPAIGNS'
            ? [...current, 'AI', 'CAMPAIGNS']
            : [...current, serviceKey],
      };
    });
  };

  const getMinServicePrice = (plan) => {
    if (!plansData) return 0;

    const prices = plansData
      .map((service) => service[plan.priceKey])
      .filter((price) => price > 0); // ignore free services

    if (prices.length === 0) return 0;

    return Math.min(...prices);
  };

  useEffect(() => {
    if (!plansData) return;

    const defaultSelected = plansData
      .filter((s) => s.monthly !== 0)
      .map((s) => s.serviceKey);

    const initial = plans.reduce((acc, plan) => {
      acc[plan.id] = defaultSelected;
      return acc;
    }, {});

    setSelectedServices(initial);
  }, [plansData]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className='min-h-screen bg-background'>
      <div className='mx-auto max-w-7xl px-4 pb-8 pt-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            {/* <Image
              src='/Logo.png'
              alt='Logo'
              width={139}
              height={32}
              className='my-4 mx-0'
              priority
            /> */}
            <TempLogo width={130} height={28} />
          </div>

          <div className='flex items-center gap-2'>
            <Stepper currentStep={1} totalSteps={3} />
          </div>
        </div>

        {/* Title and subtitle */}
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h1 className='text-lg font-semibold text-gray-900 text-body'>
              Select a Plan to Get started
            </h1>
            <p className='text-sm font-normal text-gray-600'>
              Manage your team members and their account permissions here.
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>Locations:</span>
            <div className='flex items-center gap-2 rounded-lg border border-brand-500 bg-brand-50 p-1'>
              <Button
                size='icon'
                variant='primary'
                className='h-9 w-9 rounded-md'
                onClick={handleDecrement}
                disabled={locations <= 1}
              >
                <Minus className='h-5 w-5' />
              </Button>
              <span className='w-8 text-center text-sm font-medium'>
                {locations}
              </span>
              <Button
                size='icon'
                variant='primary'
                className='h-9 w-9 rounded-md'
                onClick={handleIncrement}
                disabled={locations >= 10}
              >
                <Plus className='h-5 w-5' />
              </Button>
            </div>
          </div>
        </div>

        {/* Pricing cards */}
        <div className='grid gap-0 lg:grid-cols-[300px_1fr]'>
          {/* Features column */}
          <div className='space-y-4'>
            <h2 className='text-xl font-bold font-body px-4 py-14.75 text-gray-900  mb-0 leading-7.25'>
              Services
            </h2>
            <div className='border-y border-border divide-y'>
              {plansData?.map((feature) => (
                <div key={feature.id} className='space-y-1 py-2 px-4'>
                  <div className='flex items-center gap-2 mb-0'>
                    <span className='text-xl text-black font-semibold leading-7.5 mb-0'>
                      {feature.serviceName}
                    </span>
                    {feature.hasInfo && (
                      <Info className='h-4 w-4 text-muted-foreground' />
                    )}
                  </div>

                  {feature.description && (
                    <p className='text-xs text-gray-600'>
                      {feature.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Plans grid */}
          <div className='grid gap-4 md:grid-cols-3'>
            {plans.map((plan) => {
              const isPaymentBtnDisabled = selectedServices[plan.id]?.length;

              return (
                <Card
                  key={plan.id}
                  className={`relative overflow-hidden border ${
                    plan.popular
                      ? 'border-brand-500 shadow-lg bg-brand-50'
                      : 'border-border bg-white'
                  }`}
                >
                  {plan.popular && (
                    <Badge variant='success' className='absolute right-2 top-2'>
                      Most Popular
                    </Badge>
                  )}

                  <div className='my-7 space-y-2 text-center align-middle'>
                    <h3 className='text-lg font-semibold text-gray-600 leading-7 mb-0'>
                      {plan.name}
                    </h3>
                    <div className='flex items-center justify-center'>
                      <span className='text-3xl font-bold leading-9.5 text-gray-900 mb-0'>
                        ₹{calculatePerMonthPrice(plan).toLocaleString('en-IN')}
                        /mo
                      </span>
                    </div>
                    <p className='text-xs text-gray-600 leading-4.5'>
                      You Pay: ₹{calculateTotal(plan).toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Features checkmarks */}
                  <div className='mb-0 space-y-3 border-y border-border divide-y'>
                    {plansData?.map((service) => (
                      <div
                        key={service.id}
                        className={`flex items-center justify-center mb-0 ${service.monthly === 0 ? 'py-5' : 'py-6'}`}
                      >
                        {service.monthly === 0 ? (
                          <Badge variant='success'>Free</Badge>
                        ) : (
                          <Checkbox
                            checked={
                              selectedServices[plan.id]
                                ? selectedServices[plan.id].includes(
                                    service.serviceKey
                                  )
                                : false
                            }
                            onChange={() =>
                              toggleService(plan.id, service.serviceKey)
                            }
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div
                    className={`${plan.popular ? 'bg-brand-100' : ''} py-3.5 `}
                  >
                    <Button
                      className='mx-auto w-full max-w-[256px] flex'
                      variant='primary'
                      size='lg'
                      disabled={!isPaymentBtnDisabled}
                      onClick={async () => {
                        if (!isPaymentBtnDisabled) {
                          return;
                        }

                        const selected = selectedServices[plan.id] || [];

                        const subtotal = selected.reduce((sum, serviceKey) => {
                          const service = plansData.find(
                            (s) => s.serviceKey === serviceKey
                          );
                          if (!service) return sum;

                          return sum + service[plan.priceKey];
                        }, 0);

                        const totalAmount =
                          subtotal * locations * plan.billingMultiplier;

                        const durationTypeMap = {
                          monthly: 'MONTHLY',
                          halfYearly: 'HALF_YEARLY',
                          yearly: 'ANNUAL',
                        };

                        const previewData = await postPayment({
                          serviceKeys: selected,
                          durationType: durationTypeMap[plan.priceKey],
                          locationCount: locations,
                        });

                        if (!previewData) return;

                        setPricePreviewData(previewData);
                        setSelectedPlanForPayment({
                          plan,
                          locations,
                          selectedServices: selected,
                          baseAmount: 0,
                          serviceAmount: totalAmount,
                        });
                      }}
                    >
                      <CreditCard className='mr-2 h-4 w-4' />
                      Purchase
                    </Button>
                  </div>

                  <p className='my-2 text-center text-xs text-gray-600'>
                    ₹{getMinServicePrice(plan)} per service / location
                  </p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Enterprise section */}
        <div className='mt-12 flex items-center justify-between rounded-lg border bg-card p-6'>
          <div>
            <h2 className='text-4xl font-semibold font-body text-gray-900'>
              Need more than 10 locations?
            </h2>
            <p className='text-xl mt-2 font-normal text-gray-600'>
              Our sales team can help set it up for you?
            </p>
          </div>
          <Button variant='primary' className='h-12 w-full max-w-32'>
            Contact Us
          </Button>
        </div>
      </div>
      {selectedPlanForPayment && (
        <CreateCampaignPaymentSummary
          open={true}
          setOpen={() => {
            setSelectedPlanForPayment(null);
            setPricePreviewData(null);
          }}
          campaignId={null}
          campaignName={selectedPlanForPayment.plan.name}
          totalBudget={
            pricePreviewData?.gstBreakdown?.totalAmountPaise / 100 ??
            selectedPlanForPayment.baseAmount +
              selectedPlanForPayment.serviceAmount
          }
          usingIn='onboarding'
          planData={selectedPlanForPayment}
          pricePreviewData={pricePreviewData}
        />
      )}
    </div>
  );
}
