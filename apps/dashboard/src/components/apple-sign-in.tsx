"use client";

import { getUrl } from "@/utils/environment";
import { isDesktopApp } from "@neoai/desktop-client/platform";
import { createClient } from "@neoai/supabase/client";
import { Icons } from "@neoai/ui/icons";
import { SubmitButton } from "@neoai/ui/submit-button";
import { useState } from "react";

export function AppleSignIn() {
  const [isLoading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSignIn = async () => {
    setLoading(true);

    if (isDesktopApp()) {
      const redirectTo = new URL("/api/auth/callback", getUrl());

      redirectTo.searchParams.append("provider", "apple");
      redirectTo.searchParams.append("client", "desktop");

      await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: redirectTo.toString(),
          queryParams: {
            client: "desktop",
          },
        },
      });
    } else {
      await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: `${getUrl()}/api/auth/callback?provider=apple`,
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
        <Icons.Apple />
        <span>Continue with Apple</span>
      </div>
    </SubmitButton>
  );
}
