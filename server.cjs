// server.js
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
// Use environment variable with proper fallback
const PORT = parseInt(process.env.PORT || "3002", 10);
const HOST = process.env.HOST || "0.0.0.0";

const app = next({ 
  dev,
  // Explicitly set hostname and port for Next.js
  hostname: HOST,
  port: PORT
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url || "/", true);
      const { pathname, query } = parsedUrl;

      // ✅ Health check
      if (pathname === "/healthz") {
        res.statusCode = 200;
        res.end("ok");
        return;
      }

      // ✅ Default Next.js handler
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  server.once('error', (err) => {
    console.error("Server error:", err);
    process.exit(1);
  });

  server.listen(PORT, HOST, () => {
    console.log(
      `> Server running on http://${HOST}:${PORT} (NODE_ENV=${process.env.NODE_ENV || "development"})`
    );
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});