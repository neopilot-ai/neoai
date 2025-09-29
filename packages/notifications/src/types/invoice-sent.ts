import { getI18n } from "@neoai/email/locales";
import { encrypt } from "@neoai/encryption";
import { getAppUrl } from "@neoai/utils/envs";
import type { NotificationHandler } from "../base";
import { invoiceSentSchema } from "../schemas";

export const invoiceSent: NotificationHandler = {
  schema: invoiceSentSchema,

  createActivity: (data, user) => ({
    teamId: user.team_id,
    userId: user.id,
    type: "invoice_sent",
    source: "user",
    priority: 3,
    metadata: {
      recordId: data.invoiceId,
      invoiceNumber: data.invoiceNumber,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
    },
  }),

  createEmail: (data, user, team) => {
    const { t } = getI18n({ locale: user?.locale ?? "en" });

    return {
      template: "invoice",
      emailType: "customer",
      to: [data.customerEmail],
      subject: t("invoice.sent.subject", {
        teamName: team.name,
      }),
      from: `${team.name} <neoaibot@khulnasoft.com>`,
      data: {
        customerName: data.customerName,
        teamName: team.name,
        link: `${getAppUrl()}/i/${encodeURIComponent(
          data.token,
        )}?viewer=${encodeURIComponent(encrypt(data.customerEmail))}`,
      },
    };
  },
};
