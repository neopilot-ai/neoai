import { z } from "@hono/zod-openapi";

export const createAttachmentsSchema = z.array(
  z.object({
    path: z.array(z.string()),
    name: z.string(),
    size: z.number(),
    transactionId: z.string(),
    type: z.string(),
  }),
);

export const deleteAttachmentSchema = z.object({ id: z.string() });

export const processTransactionAttachmentSchema = z.array(
  z.object({
    transactionId: z.string(),
    mimetype: z.string(),
    filePath: z.array(z.string()),
  }),
);
