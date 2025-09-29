import type { Bindings } from "@engine/common/bindings";
import { ErrorSchema } from "@engine/common/schema";
import type { Providers } from "@engine/providers/types";
import { createErrorResponse } from "@engine/utils/error";
import { SearchClient } from "@engine/utils/search";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { env } from "hono/adapter";
import {
  InstitutionByIdParamsSchema,
  InstitutionParamsSchema,
  InstitutionSchema,
  InstitutionsSchema,
  UpdateUsageParamsSchema,
  UpdateUsageSchema,
} from "./schema";
import { excludedInstitutions } from "./utils";

type Document = {
  id: string;
  name: string;
  logo: string | null;
  available_history: number | null;
  maximum_consent_validity: number | null;
  provider: Providers;
  popularity: number;
  countries: string[];
  type?: "personal" | "business";
};

type SearchResult = {
  hits: {
    document: Document;
  }[];
};

const app = new OpenAPIHono<{ Bindings: Bindings }>()
  .openapi(
    createRoute({
      method: "get",
      path: "/",
      summary: "Get Institutions",
      request: {
        query: InstitutionParamsSchema,
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: InstitutionsSchema,
            },
          },
          description: "Retrieve institutions",
        },
        400: {
          content: {
            "application/json": {
              schema: ErrorSchema,
            },
          },
          description: "Returns an error",
        },
      },
    }),
    async (c) => {
      const envs = env(c);
      const { countryCode, q = "*", limit = "50" } = c.req.valid("query");

      const typesense = SearchClient(envs);

      const searchParameters = {
        q,
        query_by: "name",
        filter_by: `countries:=[${countryCode}]`,
        limit: +limit,
        sort_by: "popularity:desc",
      };

      try {
        const result = await typesense
          .collections("institutions")
          .documents()
          .search(searchParameters);

        const resultString: string =
          typeof result === "string" ? result : JSON.stringify(result);

        const data: SearchResult = JSON.parse(resultString);

        const filteredInstitutions = data.hits.filter(
          ({ document }) => !excludedInstitutions.includes(document.id),
        );

        return c.json(
          {
            data: filteredInstitutions.map(({ document }) => ({
              id: document.id,
              name: document.name,
              logo: document.logo ?? null,
              popularity: document.popularity,
              available_history:
                typeof document.available_history === "string"
                  ? Number(document.available_history)
                  : null,
              maximum_consent_validity:
                typeof document.maximum_consent_validity === "number"
                  ? document.maximum_consent_validity
                  : null,
              provider: document.provider,
              type: document.type ?? null,
            })),
          },
          200,
        );
      } catch (error) {
        const errorResponse = createErrorResponse(error);

        return c.json(errorResponse, 400);
      }
    },
  )
  .openapi(
    createRoute({
      method: "put",
      path: "/{id}/usage",
      summary: "Update Institution Usage",
      request: {
        params: UpdateUsageParamsSchema,
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: UpdateUsageSchema,
            },
          },
          description: "Update institution usage",
        },
        400: {
          content: {
            "application/json": {
              schema: ErrorSchema,
            },
          },
          description: "Returns an error",
        },
      },
    }),
    async (c) => {
      const envs = env(c);
      const id = c.req.param("id");

      const typesense = SearchClient(envs);

      try {
        const original = await typesense
          .collections("institutions")
          .documents(id)
          .retrieve();

        const result = await typesense
          .collections("institutions")
          .documents(id)
          .update({
            // @ts-ignore
            popularity: (original?.popularity ?? 0) + 1,
          });

        const data = result as Document;

        return c.json(
          {
            data: {
              id: data.id,
              name: data.name,
              logo: data.logo ?? null,
              available_history:
                typeof data.available_history === "string"
                  ? Number(data.available_history)
                  : null,
              maximum_consent_validity:
                typeof data.maximum_consent_validity === "string"
                  ? data.maximum_consent_validity
                  : null,
              popularity: data.popularity,
              provider: data.provider,
              type: data.type ?? null,
              country: Array.isArray(data.countries)
                ? data.countries.at(0)
                : undefined,
            },
          },
          200,
        );
      } catch (error) {
        const errorResponse = createErrorResponse(error);

        return c.json(errorResponse, 400);
      }
    },
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/:id",
      summary: "Get Institution by ID",
      request: {
        params: InstitutionByIdParamsSchema,
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: InstitutionSchema,
            },
          },
          description: "Retrieve institution by id",
        },
        404: {
          content: {
            "application/json": {
              schema: ErrorSchema,
            },
          },
          description: "Institution not found",
        },
        400: {
          content: {
            "application/json": {
              schema: ErrorSchema,
            },
          },
          description: "Institution not found",
        },
      },
    }),
    async (c) => {
      const envs = env(c);
      const { id } = c.req.valid("param");

      const typesense = SearchClient(envs);

      try {
        const result = (await typesense
          .collections("institutions")
          .documents(id)
          .retrieve()) as Document;

        return c.json(
          {
            name: result.name,
            provider: result.provider,
            id: result.id,
            logo: result.logo ?? null,
            available_history:
              typeof result.available_history === "string"
                ? Number(result.available_history)
                : null,
            maximum_consent_validity:
              typeof result.maximum_consent_validity === "number"
                ? result.maximum_consent_validity
                : null,
            country: Array.isArray(result.countries)
              ? result.countries.at(0)
              : undefined,
            type: result.type ?? null,
            popularity: result.popularity,
          },
          200,
        );
      } catch (error) {
        const errorResponse = createErrorResponse(error);
        return c.json(errorResponse, 404);
      }
    },
  );

export default app;
