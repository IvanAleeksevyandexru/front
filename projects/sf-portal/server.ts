import 'zone.js/dist/zone-node';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { HOST_URL } from './src/app/tokens/host-url.token';
import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import config from './src/assets/config/config.json';
import isbot from 'isbot';
import * as path from 'path';
import * as express from 'express';
import { Request, Response, Express } from 'express';

export function app(): Express {
  const server = express();
  const distFolder = path.join(process.cwd(), 'dist/sf-portal');
  const indexHtml = path.join(distFolder, 'index.html');

  isbot.extend(config.isbotExtend || []);

  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
    }),
  );

  server.set('view engine', 'html');
  server.set('views', distFolder);
  server.use(express.static(path.join(distFolder)));

  server.get('*', (req: Request, res: Response) => {
    const hostUrl = req.protocol + '://' + req.get('Host');

    if (isbot(req.header('User-Agent'))) {
      res.render(
        indexHtml,
        {
          req,
          res,
          providers: [
            { provide: APP_BASE_HREF, useValue: req.baseUrl },
            { provide: HOST_URL, useValue: hostUrl },
          ],
        },
        (err, html) => {
          if (!err) {
            res.send(html);
            return;
          }

          console.error('Error while SSR:', err);
        },
      );
    } else {
      res.sendFile(indexHtml);
    }
  });

  return server;
}

function run(): void {
  const port = process.env.PORT || 8888;
  const server = app();

  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
