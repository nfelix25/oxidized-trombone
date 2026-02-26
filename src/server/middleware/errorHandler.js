// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  const status = err.status ?? 500;
  const message = err.message ?? "Internal server error";
  console.error(`[server] ${status} ${message}`, err.stack ?? "");
  res.status(status).json({ error: message });
}
