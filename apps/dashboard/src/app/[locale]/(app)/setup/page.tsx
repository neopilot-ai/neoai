import { SetupForm } from "@/components/setup-form";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrateClient } from "@/trpc/server";
import { Icons } from "@neoai/ui/icons";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Setup account | Neoai",
};

export default async function Page() {
  const queryClient = getQueryClient();
  const user = await queryClient.fetchQuery(trpc.user.me.queryOptions());

  if (!user?.id) {
    return redirect("/");
  }

  return (
    <div>
      <div className="absolute left-5 top-4 md:left-10 md:top-10">
        <Link href="/">
          <Icons.LogoSmall />
        </Link>
      </div>

      <div className="flex min-h-screen justify-center items-center overflow-hidden p-6 md:p-0">
        <div className="relative z-20 m-auto flex w-full max-w-[380px] flex-col">
          <div className="text-center">
            <h1 className="text-lg mb-2 font-serif">Update your account</h1>
            <p className="text-[#878787] text-sm mb-8">
              Add your name and an optional avatar.
            </p>
          </div>

          <HydrateClient>
            <SetupForm />
          </HydrateClient>
        </div>
      </div>
    </div>
  );
}
