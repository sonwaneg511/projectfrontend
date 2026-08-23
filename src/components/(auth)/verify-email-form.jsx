"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useVerifyEmail } from "@/hooks/mutations/auth";
// import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { TempLogo } from '@/assets/icons/templogo';

export const VerifyEmailForm = () => {
  const searchParams = useSearchParams();
  const hasToken = searchParams.has("token");
  const token = searchParams.get("token");

  const { isPending, mutateAsync, isSuccess } = useVerifyEmail();

  useEffect(() => {
    (async () => {
      await mutateAsync({
        token,
      });
    })();
  }, []);

  if (isPending) {
    return null;
  }

  return (
    <div className="w-full h-screen p-6 md:p-10 flex flex-col">
      <div className="flex items-center">
        {/* <Image src="/Logo.png" alt="Caliper Logo" width={188} height={42} /> */}
        <TempLogo width={'188'} height={'42'} />
      </div>
      <div className="flex-1 w-full flex items-center justify-center">
        <Card
          className={"max-w-[382px] w-full bg-white border-gray-200 shadow-md"}
        >
          <CardHeader>
            <CardTitle className={"text-2xl text-center"}>
              {hasToken ? "Email Verify" : "404 Not Found"}
            </CardTitle>
          </CardHeader>
          <CardContent className={"flex flex-col items-center"}>
            {hasToken ? (
              <>
                <CardDescription className={"mb-6 text-black text-sm"}>
                  {isSuccess
                    ? "Verification Succeeded!"
                    : "Verification Failed. The current link has expired."}
                </CardDescription>
                <Button variant={"primary"} asChild>
                  <Link href={isSuccess ? "/login" : "/"}>
                    {isSuccess ? "Back to Login" : "Back to Home"}
                  </Link>
                </Button>
              </>
            ) : (
              <Button variant={"primary"} asChild>
                <Link href={"/"}>Back to Home</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
