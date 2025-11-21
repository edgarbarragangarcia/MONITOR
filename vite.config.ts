import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        // Lightweight server-side proxy to fetch external resources (e.g., Google Sheets)
        // Avoids relying on unstable third-party CORS proxies during local development
        configureServer(server) {
          server.middlewares.use('/proxy', async (req, res) => {
            try {
              const reqUrl = new URL(req.url || '', 'http://localhost');
              const target = reqUrl.searchParams.get('url');
              if (!target) {
                res.statusCode = 400;
                res.end('Missing url query param');
                return;
              }

              const controller = new AbortController();
              const timeout = setTimeout(() => controller.abort(), 10000);
              const upstream = await fetch(target, { signal: controller.signal });
              clearTimeout(timeout);

              const contentType = upstream.headers.get('content-type') || 'text/plain; charset=utf-8';
              res.setHeader('Content-Type', contentType);
              res.statusCode = upstream.status;
              const body = await upstream.text();
              res.end(body);
            } catch (e) {
              res.statusCode = 502;
              res.end('Proxy error');
            }
          });
        }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
