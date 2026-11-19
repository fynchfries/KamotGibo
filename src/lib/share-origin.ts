import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestUrl } from "@tanstack/react-start/server";

// Reads the existing SSR request only; this does not create an RPC or API endpoint.
export const getShareOrigin = createIsomorphicFn()
  .server(() => {
    try {
      return getRequestUrl({ xForwardedHost: false }).origin;
    } catch {
      return "";
    }
  })
  .client(() => window.location.origin);
