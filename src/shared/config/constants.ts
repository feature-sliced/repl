export const SCOPE_DATA_KEY = "__SCOPE_DATA__";

export const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
export const IS_PRODUCTION = process.env.NODE_ENV === "production";
export const IS_BROWSER = typeof window !== "undefined";
