import { useQuery, UseQueryOptions } from "react-query";
import stringify from "fast-json-stable-stringify";

import { FetchRequest, FetchResponse, Endpoints } from "@cuppazee/api";
import useToken from "./useToken";

const getMunzeeData = async <Path extends keyof Endpoints>(
  endpoint: FetchRequest<Path>["endpoint"],
  params: FetchRequest<Path>["params"],
  token: string
): Promise<FetchResponse<Path> | null> => {
  var body = new FormData();
  body.append("data", JSON.stringify(params));
  body.append("access_token", token);
  var response = await fetch(
    "https://api.munzee.com/" +
      endpoint?.replace(/{([A-Za-z0-9_]+)}/g, string => {
        return params?.[string[1] as keyof FetchRequest<Path>["params"]] || "";
      }) +
      ((params as any)?.method === "get" ? `?access_token=${encodeURIComponent(token)}` : ""),
    {
      method: (params as any)?.method === "get" ? "GET" : "POST",
      body: (params as any)?.method === "get" ? undefined : body,
    }
  );
  if (!response.ok) {
    throw {
      json: response.json(),
      ok: response.ok,
      redirected: response.redirected,
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      type: response.type,
      params,
    };
  }
  // TODO: FROM value
  return await response.json();
};

export default function useMunzeeRequest<Path extends keyof Endpoints>(
  endpoint: FetchRequest<Path>["endpoint"],
  params: FetchRequest<Path>["params"],
  user_id?: number,
  options?: UseQueryOptions<
    FetchResponse<Path, Endpoints[Path]> | null,
    unknown,
    FetchResponse<Path, Endpoints[Path]> | null
  >
) {
  const token = useToken();
  const data = useQuery(
    ["munzee", endpoint, stringify(params), user_id],
    () => getMunzeeData(endpoint, params, token.token?.access_token),
    { ...(options as any) ?? {}, enabled: token.status === "valid" && (options?.enabled ?? true) }
  );
  return {
    tokenStatus: token,
    ...data,
  };
}
