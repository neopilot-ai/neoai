"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCreateProjectModal } from "@/hooks/use-create-project-modal";
import { useCreateTeamModal } from "@/hooks/use-create-team-modal";
import { saveUserPreferences } from "@/lib/user-preferences";
import { trpc } from "@/trpc/client";
import { Check, Plus, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";

interface Project {
  id: string;
  name: string;
  slug: string;
}

export function TeamSelector() {
  const t = useTranslations("teamSelector");
  const params = useParams();
  const router = useRouter();

  const { setOpen: setCreateProjectModalOpen } = useCreateProjectModal();
  const { setOpen: setCreateTeamModalOpen } = useCreateTeamModal();

  const [organizations] = trpc.organization.getAll.useSuspenseQuery();

  const organizationId = params.organization;
  const projectSlug = params.project;

  const currentTeam = organizations
    ? organizations.find((org) => org?.id === organizationId) ||
      organizations.at(0)
    : null;

  const currentProject = currentTeam?.projects?.find(
    (project: Project) => project.slug === projectSlug,
  );

  const [open, setOpen] = React.useState(false);

  const handleSetActiveTeam = async (organizationId: string) => {
    if (!organizationId) return;

    saveUserPreferences({
      lastOrganizationId: organizationId,
      lastProjectSlug: currentProject?.slug,
    });

    router.push(`/${organizationId}/default`);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <div className="flex items-center gap-3 uppercase text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="md:hidden">{currentTeam?.name}</span>
            <div className="hidden md:flex items-center gap-2">
              <span>{currentTeam?.name}</span>
              <div className="text-[11px] text-primary rounded-full border border-border px-2.5 py-0.5 capitalize">
                {currentTeam?.plan}
              </div>
            </div>
          </div>
          <span className="text-border text-xl hidden md:inline">/</span>
          <span className="hidden md:inline">{currentProject?.name}</span>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-screen md:w-[480px] h-[240px] p-0 mt-[11px] md:mt-0"
        sideOffset={10}
      >
        <div className="flex divide-x divide-border h-[240px]">
          <div className="flex-1 flex flex-col">
            <div className="p-4 text-xs font-medium text-secondary">
              {t("teams")}
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {organizations.map((org) => (
                <div
                  key={org?.id}
                  className="group flex w-full items-center justify-between p-2 px-4 text-xs hover:bg-muted cursor-default relative"
                  onClick={() => {
                    handleSetActiveTeam(org.id);
                  }}
                >
                  <span>{org?.name}</span>
                  <div className="flex items-center gap-2">
                    <Settings
                      className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground transition-opacity duration-100 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpen(false);
                        router.push(
                          `/${org?.id}/${projectSlug}/settings?tab=team`,
                        );
                      }}
                    />
                    {currentTeam?.id === org?.id && (
                      <Check className="h-4 w-4 group-hover:hidden" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setCreateTeamModalOpen(true)}
              type="button"
              className="flex w-full items-center gap-2 p-2 pb-3 text-xs text-secondary hover:text-primary transition-colors duration-100 border-t border-border"
            >
              <Plus className="h-4 w-4" />
              {t("createTeam")}
            </button>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="p-4 text-xs font-medium text-secondary">
              {t("project")}
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {currentTeam?.projects.map((project: Project) => (
                <button
                  type="button"
                  key={project.id}
                  className="group flex w-full items-center justify-between p-2 px-4 text-xs hover:bg-muted relative"
                  onClick={() => {
                    saveUserPreferences({
                      lastOrganizationId: currentTeam.id,
                      lastProjectSlug: project.slug,
                    });
                    router.push(`/${currentTeam?.id}/${project.slug}`);
                    setOpen(false);
                  }}
                >
                  <span>{project.name}</span>
                  <div className="flex items-center gap-2">
                    <Settings
                      className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground transition-opacity duration-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpen(false);
                        router.push(
                          `/${currentTeam?.id}/${project.slug}/settings`,
                        );
                      }}
                    />
                    {projectSlug === project.slug && (
                      <Check className="h-4 w-4 group-hover:hidden" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setCreateProjectModalOpen(true)}
              type="button"
              className="flex w-full items-center gap-2 p-2 pb-3 text-xs text-secondary hover:text-primary transition-colors duration-100 border-t border-border"
            >
              <Plus className="h-4 w-4" />
              {t("addProject")}
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
