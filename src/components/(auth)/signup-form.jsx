'use client';

// import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/components/ui/error-message';
import { Input } from '@/components/ui/input';
import {
  Label,
  LabelInputContainer,
  labelVariants,
} from '@/components/ui/label';
import { Loader } from '@/components/ui/loader';
import { useSignup } from '@/hooks/mutations/auth';
import { cn } from '@/lib/utils';
import 'react-international-phone/style.css';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { signupSchema } from './auth.schema';
import { PasswordInput } from './common';
import { TempLogo } from '@/assets/icons/templogo'

const _INDUSTRY_VS_SUBINDUSTRY = {
  Salon: ['Hair', 'Beard'],
  Automobile: ['Car'],
};

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobileNo: '',
    countryCode: '',
    country: '',
    // industry: "",
    // subIndustry: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    businessName: '',
    email: '',
    password: '',
    confirmPassword: '',
    serverError: '',
    mobileNo: '',
    // industry: "",
    // subIndustry: "",
  });
  const [isVerifyPopupOpen, setIsVerifyPopupOpen] = useState(false);

  const _router = useRouter();
  const { isPending, mutateAsync } = useSignup();

  // const industryOptions = Object.keys(INDUSTRY_VS_SUBINDUSTRY ?? {}).filter(
  //   Boolean,
  // );
  // const subIndustryOptions = (
  //   INDUSTRY_VS_SUBINDUSTRY?.[formData.industry] ?? []
  // ).filter(Boolean);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const isSpaceDisabled = e.target.dataset?.spacedisabled === 'false';

    if (isSpaceDisabled) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));

      setValidationErrors((prevValidationErrors) => ({
        ...prevValidationErrors,
        [name]: '',
        serverError: '',
      }));
    } else {
      if (/\s/.test(value)) {
        return;
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));

      setValidationErrors((prevValidationErrors) => ({
        ...prevValidationErrors,
        [name]: '',
        serverError: '',
      }));
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();

    const result = await signupSchema.safeParseAsync(formData);

    if (result.success) {
      try {
        const body = {
          user_id: result.data.email,
          password: result.data.password,
          phone_number: result.data.mobileNo,
          country_code: `+${result.data.countryCode}`,
          client_name: result.data.businessName,
          // industry: result.data.industry,
          // subIndustry: result.data.subIndustry
        };

        await mutateAsync(body);
        toast.success('Signup successfully.', {
          description:
            'Your account is signup successfully 🎉 Please go ahead and log in to continue.',
        });
        // router.replace("/login");
        setIsVerifyPopupOpen(true);
      } catch (error) {
        const message = error?.data?.error || 'Something went wrong.';

        if (error.message === 'Signup failed') {
          setValidationErrors((prevValidationErrors) => ({
            ...prevValidationErrors,
            serverError: message,
          }));
          toast.error(error.message, {
            description: message,
          });
        } else {
          toast.error('Please try again later', {
            description: message,
          });
        }
      }
    } else {
      const errors = result.error.issues.reduce((acc, curr) => {
        const key = curr.path[0];

        if (!acc[key]) {
          acc[key] = curr.message;
        }

        return acc;
      }, {});

      setValidationErrors((prevValidationErrors) => ({
        ...prevValidationErrors,
        ...errors,
      }));
    }
  };

  const handleCloseVerifyPopup = () => {
    setIsVerifyPopupOpen(false);
    setFormData({
      businessName: '',
      email: '',
      password: '',
      confirmPassword: '',
      mobileNo: '',
      countryCode: '',
      country: '',
      // industry: "",
      // subIndustry: "",
    });
    setValidationErrors({
      businessName: '',
      email: '',
      password: '',
      confirmPassword: '',
      serverError: '',
      mobileNo: '',
      // industry: "",
      // subIndustry: "",
    });
  };

  return (
    <>
      <div className='w-full max-w-sm flex flex-col items-center py-4'>
        <div className='w-full flex items-center justify-center mb-11'>
          <div className='flex flex-col relative'>
            {/* <Image
              src='/Logo.png'
              alt='Caliper Logo'
              width={278}
              height={64}
              priority
            /> */}
            <TempLogo  width={200} height={50} />

            <p className='absolute -bottom-[18px] right-9 text-xs text-gray-900'>
              Scale your local reach
            </p>
          </div>
        </div>
        <div className='flex flex-col gap-3 w-full items-center mb-6'>
          <h2 className='text-gray-900 font-display font-semibold text-3xl'>
            Register your account
          </h2>
          <p className='text-gray-600 text-base'>
            Welcome! Please enter your details.
          </p>
        </div>
        <form onSubmit={handleSignin} className='flex flex-col gap-5 w-full'>
          <LabelInputContainer>
            <Label htmlFor={'business-name'}>Business Name</Label>
            <Input
              id={'business-name'}
              placeholder={'Enter business name'}
              name={'businessName'}
              value={formData.businessName}
              onChange={handleInputChange}
              data-spacedisabled={false}
            />
            <p className='text-sm  text-gray-600'>This is not editable later</p>
            {validationErrors.businessName && (
              <ErrorMessage message={validationErrors.businessName} />
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor={'email'}>Email</Label>
            <Input
              id={'email'}
              placeholder={'Enter your email'}
              name={'email'}
              value={formData.email}
              onChange={handleInputChange}
            />
            {validationErrors.email && (
              <ErrorMessage message={validationErrors.email} />
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <p className={cn(labelVariants())}>Mobile</p>
            <PhoneInput
              defaultCountry='in'
              placeholder='Enter your number'
              forceDialCode={false}
              disableDialCodePrefill
              disableCountryGuess
              disableDialCodeAndPrefix
              style={{
                '--react-international-phone-height': '40px',
                '--react-international-phone-border-radius': '8px',
              }}
              className='shadow-xs rounded-md'
              inputClassName='w-full px-3'
              countrySelectorStyleProps={{
                buttonStyle: {
                  padding: '0px 8px',
                },
              }}
              value={formData.mobileNo}
              onChange={(phone, meta) => {
                const localNumber = phone.replace(
                  `+${meta.country.dialCode}`,
                  ''
                );

                setFormData((prevFormData) => ({
                  ...prevFormData,
                  mobileNo: localNumber,
                  countryCode: meta.country.dialCode,
                  country: meta.country.iso2,
                }));
                setValidationErrors((prevValidationErrors) => ({
                  ...prevValidationErrors,
                  mobileNo: '',
                }));
              }}
            />
            {validationErrors.mobileNo && (
              <ErrorMessage message={validationErrors.mobileNo} />
            )}
          </LabelInputContainer>
          {/* <LabelInputContainer>
          <p className={cn(labelVariants())}>Industry</p>
          <Select
            value={formData.industry}
            onValueChange={(value) => {
              setFormData((prevFormData) => ({
                ...prevFormData,
                industry: value,
              }));
              setValidationErrors((prevValidationErrors) => ({
                ...prevValidationErrors,
                industry: "",
              }));
            }}
          >
            <SelectTrigger className={"h-10 text-sm font-normal"}>
              <SelectValue placeholder={"Select industry"} />
            </SelectTrigger>
            <SelectContent>
              {industryOptions.map((industry) => {
                return (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {validationErrors.industry && (
            <ErrorMessage
              className={"ml-2"}
              message={validationErrors.industry}
            />
          )}
        </LabelInputContainer>
        <LabelInputContainer>
          <p className={cn(labelVariants())}>Sub-Industry</p>
          <Select
            value={formData.subIndustry}
            disabled={!formData.industry}
            onValueChange={(value) => {
              setFormData((prev) => ({ ...prev, subIndustry: value }));
              setValidationErrors((prev) => ({ ...prev, subIndustry: "" }));
            }}
          >
            <SelectTrigger className={"h-10 text-sm font-normal"}>
              <SelectValue placeholder={"Select sub industry"} />
            </SelectTrigger>
            <SelectContent>
              {subIndustryOptions.map((sub) => (
                <SelectItem key={sub} value={sub}>
                  {sub}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors.subIndustry && (
            <ErrorMessage
              className={"ml-2"}
              message={validationErrors.subIndustry}
            />
          )}
        </LabelInputContainer> */}
          <LabelInputContainer>
            <Label htmlFor={'password'}>Password</Label>
            <PasswordInput
              id={'password'}
              placeholder={'Enter your password'}
              name={'password'}
              value={formData.password}
              onChange={handleInputChange}
            />
            {validationErrors.password && (
              <ErrorMessage message={validationErrors.password} />
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor={'confirm-password'}>Confirm Password</Label>
            <PasswordInput
              id={'confirm-password'}
              placeholder={'Enter your password'}
              name={'confirmPassword'}
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            {validationErrors.confirmPassword && (
              <ErrorMessage message={validationErrors.confirmPassword} />
            )}
            {validationErrors.serverError && (
              <ErrorMessage message={validationErrors.serverError} />
            )}
          </LabelInputContainer>
          <Button disabled={isPending} variant={'primary'} size={'lg'}>
            {isPending && <Loader />}
            {isPending ? 'Signing' : 'Sign'} up
          </Button>
        </form>
        <div className='text-sm text-gray-700 w-full flex items-center justify-center gap-1 mt-4'>
          <p>Already have an Account?</p>
          <Link
            href={'/login'}
            className='text-brand-700 font-semibold underline'
          >
            Login
          </Link>
        </div>
      </div>
      <AlertDialog open={isVerifyPopupOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Verify Your Email</AlertDialogTitle>
          </AlertDialogHeader>
          <div>
            <p className='text-sm text-gray-500'>
              We've sent a verification link to your email address. Please check
              your inbox and click the link to verify your email before signing
              in. If you don't see the email, check your spam or junk folder.
            </p>
          </div>
          <AlertDialogFooter>
            <Button variant={'primary'} onClick={handleCloseVerifyPopup}>
              Got it
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
