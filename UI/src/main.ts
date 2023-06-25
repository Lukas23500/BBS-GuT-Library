import { API_BASE_URL, CLIENT_URL } from 'api-lib';
import { AppModule } from './app/app.module';
import { enableProdMode } from '@angular/core';
import { environment } from './assets/environments/environment.prod';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

if (environment.production) {
  enableProdMode();
}

async function main() {
  try {
    let _env = 'development';
    if (environment.production) _env = 'production';

    const data = await fetch('./assets/config/' + _env + '.json');
    const config = await data.json();

    await platformBrowserDynamic([
      { provide: CLIENT_URL, useValue: config.CLIENT_URL },
      { provide: API_BASE_URL, useValue: config.API_ENDPOINT },
    ])
      .bootstrapModule(AppModule)
      .catch((err) => console.error(err));
  } catch (error) {
    console.error(error);
  }
}

main();
