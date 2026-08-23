'use client';

import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { XIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/auth.context';
import { usePlanCreatePayment } from '@/hooks/mutations/payment';
import { calculatePlanPayable, formatNumber } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { calculatePayable } from './constants';

export const CreateCampaignPaymentSummary = ({
  open,
  setOpen,
  totalBudget,
  campaignId,
  campaignName,
  usingIn = 'campaignForm',
  planData,
  pricePreviewData,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { userDetails } = useAuth();
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const isOnboarding = usingIn === 'onboarding';

  const { mutateAsync: createPayment } = usePlanCreatePayment(
    usingIn === 'onboarding' ? null : userDetails?.clientId
  );

  const amounts =
    isOnboarding && pricePreviewData
      ? {
          subtotal: pricePreviewData.totalAmountRupees,
          sgst: pricePreviewData.gstBreakdown.sgstPaise / 100,
          cgst: pricePreviewData.gstBreakdown.cgstPaise / 100,
          grandTotal: pricePreviewData.gstBreakdown.totalAmountPaise / 100,
          sgstRate: pricePreviewData.gstBreakdown.sgstRate,
          cgstRate: pricePreviewData.gstBreakdown.cgstRate,
        }
      : isOnboarding
        ? calculatePlanPayable({
            baseAmount: planData?.baseAmount,
            serviceAmount: planData?.serviceAmount,
          })
        : calculatePayable(+totalBudget);

  // -----------------------------------
  // Razorpay Script Load
  // -----------------------------------
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setIsRazorpayLoaded(true);
    document.body.appendChild(script);
  }, []);

  // -----------------------------------
  // Unified Payment Status Handler
  // -----------------------------------
  const handlePaymentStatus = useCallback(
    async ({ order, status, response = null }) => {
      const today = format(new Date(), 'yyyy-MM-dd');

      try {
        let createdPlanId = null;

        // -----------------------------------
        // 1️⃣ If onboarding + SUCCESS → create plan
        // -----------------------------------
        if (usingIn === 'onboarding' && status === 'SUCCESS') {
          const startDate = today;

          const endDateObj = new Date();
          endDateObj.setMonth(
            endDateObj.getMonth() + planData.plan.billingMultiplier
          );

          const endDate = format(endDateObj, 'yyyy-MM-dd');

          const createPlanPayload = {
            service_ids: planData.selectedServices,
            user_id: userDetails?.user_id,
            start_date: startDate,
            end_date: endDate,
            location_count: planData.locations,
          };

          const planRes = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/plan/createplan`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(createPlanPayload),
            }
          );

          if (!planRes.ok) {
            throw new Error('Plan creation failed');
          }

          const createdPlan = await planRes.json();
          createdPlanId = createdPlan?.id;
        }

        // -----------------------------------
        // 2️⃣ Only record payment if SUCCESS
        // -----------------------------------
        if (status === 'SUCCESS') {
          const paymentPayload = {
            payment_id: response?.razorpay_payment_id,
            order_id: response?.razorpay_order_id,
            amount: order.amount,
            status: 'SUCCESS',
            payment_method: 'Razorpay',
            transaction_date_time: today,
            error_description: null,
            amount_refunded: '0',
            inserted_date: today,
            is_plan: usingIn === 'onboarding',
            is_campaign: usingIn !== 'onboarding',
            campaign_id: usingIn !== 'onboarding' ? campaignId : null,
            plan_id: createdPlanId,
          };

          await createPayment({ payment_plan_request: paymentPayload });

          toast.success('Payment Successful');

          router.push(
            usingIn === 'onboarding' ? '/account-access' : '/campaigns'
          );
        } else {
          if (['campaignForm', 'campaignTable'].includes(usingIn)) {
            const body = {
              payment_id: null,
              order_id: null,
              amount: order.amount,
              status: 'FAILED',
              payment_method: 'Razorpay',
              transaction_date_time: today,
              error_description: null,
              amount_refunded: '0',
              insterted_date: today,
              is_plan: false,
              is_campaign: true,
              campaign_id: campaignId,
              plan_id: null,
            };

            await createPayment({ payment_plan_request: body });

            if (usingIn === 'campaignForm') {
              router.push('/campaigns');
            }
          } else if (usingIn === 'onboarding') {
            router.push('/account-access');
          }
          toast.error('Payment Failed');
        }
      } catch (error) {
        console.error('Payment Flow Error:', error);
        toast.error('Plan creation failed. Payment not recorded.');

        // Optional: reopen dialog
        setOpen(true);
      }
    },
    [usingIn, campaignId, planData, createPayment, router, userDetails, setOpen]
  );

  // -----------------------------------
  // Onboarding — Step 4: Verify payment & activate plan
  // -----------------------------------
  const handleOnboardingVerify = useCallback(
    async (paymentResponse) => {
      try {
        const verifyRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/plan/payment/verify`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpaySignature: paymentResponse.razorpay_signature,
              clientId: userDetails?.clientId,
            }),
          }
        );

        if (!verifyRes.ok) {
          throw new Error('Verification request failed');
        }

        const result = await verifyRes.json();

        if (result.success) {
          toast.success('Payment Successful');
          await queryClient.refetchQueries({ queryKey: ['user-self'] });
          router.push('/campaign-setup');
        } else {
          throw new Error(result.message || 'Payment verification failed');
        }
      } catch (error) {
        console.error('Onboarding Verify Error:', error);
        toast.error('Payment verification failed. Please contact support.');
        setOpen(true);
      }
    },
    [userDetails, router, setOpen, queryClient.refetchQueries]
  );

  // -----------------------------------
  // Razorpay Flow
  // -----------------------------------
  const handlePayNow = async () => {
    if (!isRazorpayLoaded) return;
    setOpen(false);

    // ── Onboarding: create order via backend ────────────────────────────────
    if (isOnboarding) {
      let order;

      try {
        const orderRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/plan/payment/create-order`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              clientId: userDetails?.clientId,
              userId: userDetails?.user_id,
              serviceKeys: pricePreviewData?.serviceBreakdown?.map(
                (s) => s.serviceKey
              ),
              durationType: pricePreviewData?.durationType,
              locationCount: pricePreviewData?.locationCount,
            }),
          }
        );

        if (!orderRes.ok) {
          throw new Error('Failed to create payment order');
        }

        order = await orderRes.json();
      } catch (error) {
        console.error('Create Order Error:', error);
        toast.error('Could not initiate payment. Please try again.');
        setOpen(true);
        return;
      }

      const options = {
        key: order.keyId,
        amount: order.amountPaise,
        currency: order.currency,
        order_id: order.razorpayOrderId,
        name: 'Caliper',
        description: `Payment for ${campaignName}`,

        handler: async (paymentResponse) => {
          await handleOnboardingVerify(paymentResponse);
        },

        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled');
            setOpen(true);
          },
        },

        prefill: {
          name: userDetails?.clientId || userDetails?.user_id,
        },

        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', () => {
        toast.error('Payment failed. Please try again.');
        setOpen(true);
      });

      rzp.open();
      return;
    }

    // ── Campaign flow (unchanged) ────────────────────────────────────────────
    const res = await fetch('/api/razorpay/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: amounts.grandTotal,
        campaignId,
        clientName: userDetails?.clientId,
        clientId: userDetails?.user_id,
      }),
    });

    const order = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: 'INR',
      name: 'Caliper',
      description: `Payment for ${campaignName}`,
      order_id: order.id,

      handler: async (response) => {
        await handlePaymentStatus({
          order,
          status: 'SUCCESS',
          response,
        });
      },

      modal: {
        ondismiss: async () => {
          await handlePaymentStatus({
            order,
            status: 'FAILED',
          });
        },
      },

      prefill: {
        name: userDetails?.clientId || userDetails?.user_id,
      },

      theme: {
        color: '#3399cc',
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', async () => {
      await handlePaymentStatus({
        order,
        status: 'FAILED',
      });
    });

    rzp.open();
  };

  // -----------------------------------
  // UI
  // -----------------------------------

  const handleCloseSummary = (value) => {
    setOpen(value);

    if (usingIn === 'campaignForm') {
      if (value === false) {
        router.push('/campaigns');
      }
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleCloseSummary}>
      <AlertDialogContent className='px-0'>
        <AlertDialogHeader className='flex-row justify-between items-center px-4'>
          <AlertDialogTitle>Payment Summary</AlertDialogTitle>
          <AlertDialogCancel asChild>
            <Button variant='ghost' size='icon'>
              <XIcon size={18} />
            </Button>
          </AlertDialogCancel>
        </AlertDialogHeader>
        <div className='flex flex-col gap-4 px-4'>
          <div className='text-sm font-semibold'>
            <p>
              Client:{' '}
              <span className='font-normal'>
                {userDetails?.clientName || userDetails?.user_id}
              </span>
            </p>
            <p>
              {isOnboarding ? 'Plan' : 'Campaign Name'}:{' '}
              <span className='font-normal'>{campaignName}</span>
            </p>
            {isOnboarding && pricePreviewData && (
              <p>
                Locations:{' '}
                <span className='font-normal'>
                  {pricePreviewData.locationCount}
                </span>
              </p>
            )}
          </div>
          <div>
            <div className='flex items-center gap-4 font-semibold px-3 bg-brand-600 text-white py-2 rounded-t-md'>
              <p className='flex-1'>Description</p>
              <p className='shrink-0'>Amount</p>
            </div>
            <div className='border p-3 rounded-b-md text-sm space-y-2'>
              {/* Onboarding: dynamic service breakdown from API */}
              {isOnboarding && pricePreviewData && (
                <>
                  {pricePreviewData.serviceBreakdown.map((service) => (
                    <div
                      key={service.serviceKey}
                      className='flex justify-between'
                    >
                      <span className='font-semibold'>
                        {service.serviceName}{' '}
                        <span className='font-normal text-gray-500'>
                          ({pricePreviewData.locationCount} loc × ₹
                          {formatNumber(service.pricePerLocation)})
                        </span>
                      </span>
                      <span>₹{formatNumber(service.subtotal)}</span>
                    </div>
                  ))}
                  <div className='flex justify-between border-t pt-2'>
                    <span className='font-semibold'>Subtotal</span>
                    <span>₹{formatNumber(amounts.subtotal)}</span>
                  </div>
                </>
              )}
              {/* Onboarding: fallback static subtotal */}
              {isOnboarding && !pricePreviewData && (
                <div className='flex justify-between'>
                  <span className='font-semibold'>Subtotal</span>
                  <span>₹{formatNumber(amounts.subtotal)}</span>
                </div>
              )}
              {/* Campaign flow breakdown */}
              {!isOnboarding && (
                <>
                  <div className='flex justify-between'>
                    <span className='font-semibold'>Campaign Budget</span>
                    <span>₹{formatNumber(totalBudget)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='font-semibold'>Agency Commission</span>
                    <span>₹{formatNumber(amounts.agencyCommission)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='font-semibold'>Total Taxable Value</span>
                    <span>₹{formatNumber(amounts.taxableValue)}</span>
                  </div>
                </>
              )}
              <div className='flex justify-between'>
                <span className='font-semibold'>
                  SGST ({amounts.sgstRate ?? 9}%)
                </span>
                <span>₹{formatNumber(amounts.sgst)}</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-semibold'>
                  CGST ({amounts.cgstRate ?? 9}%)
                </span>
                <span>₹{formatNumber(amounts.cgst)}</span>
              </div>
              <div className='flex justify-between font-semibold border-t pt-2'>
                <span>Grand Total</span>
                <span>₹{formatNumber(amounts.grandTotal)}</span>
              </div>
            </div>
          </div>

          <Button
            variant='primary'
            onClick={handlePayNow}
            disabled={!isRazorpayLoaded}
          >
            Pay Now
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
