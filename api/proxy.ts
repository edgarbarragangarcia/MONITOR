export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const target = url.searchParams.get('url');
    if (!target) {
      return new Response('Missing url', { status: 400 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const upstream = await fetch(target, { signal: controller.signal });
    clearTimeout(timeout);

    const contentType = upstream.headers.get('content-type') || 'text/plain; charset=utf-8';
    const body = await upstream.text();
    return new Response(body, { status: upstream.status, headers: { 'content-type': contentType } });
  } catch (e) {
    return new Response('Proxy error', { status: 502 });
  }
}