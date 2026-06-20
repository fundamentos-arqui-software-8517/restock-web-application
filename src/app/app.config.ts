import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { iamInterceptor } from './iam/infrastructure/iam.interceptor';

import { IMqttServiceOptions, MqttService } from 'ngx-mqtt';

export const mqttServiceFactory = () => {
  return new MqttService({
    hostname: window.location.hostname,
    port: window.location.port ? Number(window.location.port) : 80,
    path: '/mqtt',
    protocol: window.location.protocol === 'https:' ? 'wss' : 'ws',
  });
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([iamInterceptor])),
    provideTranslateService({
      loader: provideTranslateHttpLoader({ prefix: './i18n/', suffix: '.json' }),
      fallbackLang: 'en',
    }),
    {
      provide: MqttService,
      useFactory: mqttServiceFactory
    }
  ],
};
