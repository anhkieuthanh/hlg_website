import { NextRequest } from "next/server";

const API_BASE_URL = process.env.HLG_API_URL || "http://127.0.0.1:4001";

type RouteContext = {
  params: {
    path: string[];
  };
};

async function proxy(request: NextRequest, context: RouteContext) {
  const path = context.params.path.join("/");
  const upstreamUrl = new URL(`/api/${path}`, API_BASE_URL);
  upstreamUrl.search = request.nextUrl.search;

  const headers = new Headers(request.headers);
  headers.delete("host");

  const upstreamResponse = await fetch(upstreamUrl, {
    method: request.method,
    headers,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.text(),
    cache: "no-store"
  });

  const responseHeaders = new Headers();
  const contentType = upstreamResponse.headers.get("content-type");
  const contentDisposition = upstreamResponse.headers.get("content-disposition");
  if (contentType) responseHeaders.set("content-type", contentType);
  if (contentDisposition) responseHeaders.set("content-disposition", contentDisposition);

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders
  });
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
