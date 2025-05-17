import { PORT, init } from '@/lib/env';
init();
import express, { Express } from 'express';
require('express-async-errors');
import cors from 'cors';
import logRequest from '@/lib/middlewares/log-request';
import createRouter from 'express-file-routing';
import http from 'http';

(async () => {
  const app: Express = express();
  const port = PORT || 3000;

  app.use(cors());
  app.options('*', cors());

  app.use(express.json());

  // Logging Middleware
  app.use(logRequest);

  // Route handlers
  await createRouter(app);

  // Error handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.log(err);
    res.status(500).json({ error: err.message });
  });

  const server = http.createServer(app);

  // Websocket Server
  // server.on("upgrade", async (request, socket, head) => {
  //   WSS.handleUpgrade(request, socket, head, (ws) => {
  //     WSS.emit("connection", ws, request);
  //   });
  // });

  server.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
})();
