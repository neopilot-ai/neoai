import type { Session } from "@api/utils/auth";
import type { Database } from "@neoai/db/client";

export type Context = {
  Variables: {
    db: Database;
    session: Session;
    teamId: string;
  };
};
