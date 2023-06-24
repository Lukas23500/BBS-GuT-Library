import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { API_BASE_URL, CLIENT_URL } from 'api-lib/projects/api-lib/src/lib/service/base.service';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

// async function main() {
//   try {
//     await platformBrowserDynamic([
//       { provide: CLIENT_URL, useValue: CLIENT_URL },
//       { provide: API_BASE_URL, useValue: API_BASE_URL },
//     ])
//       .bootstrapModule(AppModule)
//       .catch((err) => console.error(err));
//   } catch (error) {
//     console.error(error);
//   }
// }

// main();
