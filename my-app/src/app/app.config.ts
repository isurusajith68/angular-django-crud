import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideToastr({
      autoDismiss: true,
      positionClass: 'toast-top-right',
      easeTime: 300,
      timeOut: 5000,
      progressBar: true,
      closeButton: true,
      tapToDismiss: true,
    }),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
