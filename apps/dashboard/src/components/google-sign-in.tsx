"use client";

import { getUrl } from "@/utils/environment";
import { isDesktopApp } from "@neoai/desktop-client/platform";
import { createClient } from "@neoai/supabase/client";
import { Icons } from "@neoai/ui/icons";
import { SubmitButton } from "@neoai/ui/submit-button";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function GoogleSignIn() {
  const [isLoading, setLoading] = useState(false);
  const supabase = createClient();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("return_to");

  const handleSignIn = async () => {
    setLoading(true);

    if (isDesktopApp()) {
      const redirectTo = new URL("/api/auth/callback", getUrl());

      redirectTo.searchParams.append("provider", "google");
      redirectTo.searchParams.append("client", "desktop");

      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectTo.toString(),
          queryParams: {
            prompt: "select_account",
            client: "desktop",
          },
        },
      });
    } else {
      const redirectTo = new URL("/api/auth/callback", getUrl());

      if (returnTo) {
        redirectTo.searchParams.append("return_to", returnTo);
      }

      redirectTo.searchParams.append("provider", "google");

      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectTo.toString(),
          queryParams: {
            prompt: "select_account",
          },
        },
      });
    }

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <SubmitButton
      onClick={handleSignIn}
      className="bg-primary px-6 py-4 text-secondary font-medium h-[40px] w-full"
      isSubmitting={isLoading}
    >
      <div className="flex items-center space-x-2">
        <Icons.Google />
        <span>Continue with Google</span>
      </div>
    </SubmitButton>
  );
}
