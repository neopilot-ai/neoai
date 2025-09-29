import { getI18n } from "@neoai/email/locales";
import { encrypt } from "@neoai/encryption";
import { getAppUrl } from "@neoai/utils/envs";
import type { NotificationHandler } from "../base";
import { invoiceReminderSentSchema } from "../schemas";

export const invoiceReminderSent: NotificationHandler = {
  schema: invoiceReminderSentSchema,

  createActivity: (data, user) => ({
    teamId: user.team_id,
    userId: user.id,
    type: "invoice_reminder_sent",
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
      template: "invoice-reminder",
      emailType: "customer",
      to: [data.customerEmail],
      subject: t("invoice.reminder.subject", {
        invoiceNumber: data.invoiceNumber,
      }),
      from: `${team.name} <neoaibot@khulnasoft.com>`,
      data: {
        companyName: data.customerName,
        teamName: team.name,
        invoiceNumber: data.invoiceNumber,
        link: `${getAppUrl()}/i/${encodeURIComponent(
          data.token,
        )}?viewer=${encodeURIComponent(encrypt(data.customerEmail))}`,
      },
    };
  },
};
