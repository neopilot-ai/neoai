/**
 * Configuration interface for Trans
 */
export interface Config {
  /** Project ID from Trans (can be set via TRANS_PROJECT_ID env var) */
  projectId?: string;
  /** Locale configuration */
  locale: {
    /** Source language code (e.g. 'en') */
    source: string;
    /** Target language codes to translate to */
    targets: string[];
  };
  /** File configuration by format type */
  files: {
    /** Configuration for each file format */
    [format: string]: {
      /** Glob patterns to include */
      include: (string | { glob: string })[];
    };
  };
  /** Hooks */
  hooks?: {
    /** Hook to run before saving the file */
    beforeSaving?: (args: {
      content: string;
      filePath: string;
      locale: string;
      format: string;
    }) => Promise<string>;
  };
}

export interface ParserOptions {
  indent?: number;
  separator?: string;
  createMcpdata?: boolean;
  encoding?: BufferEncoding;
}

export interface Parser {
  parse(input: string, locale: string): Promise<Record<string, string>>;
  serialize(
    data: Record<string, string>,
    locale: string,
    options: ParserOptions | null,
  ): Promise<string>;
}
