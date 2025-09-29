"use client";

import { hideConnectFlowAction } from "@/actions/hide-connect-flow-action";
import { AddAccountButton } from "@/components/add-account-button";
import { useTRPC } from "@/trpc/client";
import { cn } from "@neoai/ui/cn";
import { Dialog, DialogContent } from "@neoai/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import OverViewScreenOneLight from "public/assets/overview-1-light.png";
import OverViewScreenOne from "public/assets/overview-1.png";
import OverViewScreenTwoLight from "public/assets/overview-2-light.png";
import OverViewScreenTwo from "public/assets/overview-2.png";
import { Fragment, useEffect, useState } from "react";

const images = [
  { id: 1, src: OverViewScreenOne, src2: OverViewScreenOneLight },
  { id: 2, src: OverViewScreenTwo, src2: OverViewScreenTwoLight },
];

type Props = {
  hideConnectFlow: boolean;
};

export function OverviewModal({ hideConnectFlow: hasHideConnectFlow }: Props) {
  const trpc = useTRPC();
  const [activeId, setActive] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const hideConnectFlow = useAction(hideConnectFlowAction);

  const { data: accounts } = useQuery(
    trpc.bankAccounts.get.queryOptions({
      enabled: true,
    }),
  );

  const handleOnOpenChange = () => {
    setIsOpen(!isOpen);

    if (isOpen) {
      hideConnectFlow.execute();
    }
  };

  useEffect(() => {
    // If the user has not connected any accounts and the modal is defaultOpen, open the modal
    if (!accounts?.length && !hasHideConnectFlow) {
      setIsOpen(true);
    }
  }, [accounts, hasHideConnectFlow]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOnOpenChange}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <div className="bg-background p-2">
          <div className="p-4">
            <div className="mb-8 space-y-5">
              <h2 className="font-medium text-xl">
                Get insights of your business you didn't know
              </h2>
              <p className="text-[#878787] text-sm">
                View real-time profit/revenue as well as revenue numbers.
                Compare to previous years. See what you spend your money on and
                where you can save.
              </p>
            </div>

            <div className="pb-8 relative h-[272px]">
              {images.map((image) => (
                <Fragment key={image.id}>
                  <Image
                    quality={100}
                    src={image.src}
                    width={486}
                    height={251}
                    alt="Overview"
                    className={cn(
                      "w-full opacity-0 absolute transition-all hidden dark:block",
                      image.id === activeId && "opacity-1",
                    )}
                  />

                  <Image
                    quality={100}
                    src={image.src2}
                    width={486}
                    height={251}
                    alt="Overview"
                    className={cn(
                      "w-full opacity-0 absolute transition-all block dark:hidden",
                      image.id === activeId && "opacity-1",
                    )}
                  />
                </Fragment>
              ))}
            </div>

            <div className="flex justify-between mt-12 items-center">
              <div className="flex space-x-2">
                {images.map((image) => (
                  <button
                    type="button"
                    onMouseEnter={() => setActive(image.id)}
                    onClick={() => setActive(image.id)}
                    key={image.id}
                    className={cn(
                      "w-[16px] h-[6px] rounded-full bg-[#1D1D1D] dark:bg-[#D9D9D9] opacity-30 transition-all cursor-pointer",
                      image.id === activeId && "opacity-1",
                    )}
                  />
                ))}
              </div>

              <AddAccountButton onClick={handleOnOpenChange} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
