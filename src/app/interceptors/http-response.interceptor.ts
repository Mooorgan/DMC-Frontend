import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpEventType,
} from '@angular/common/http';
import { filter, Observable, tap } from 'rxjs';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class HttpResponseInterceptor implements HttpInterceptor {
  constructor(private notification: NotificationsService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      filter((response) => {
        return response.type === HttpEventType.Response;
      }),
      tap({
        next: (value: any) => {
          this.notification.addSuccess(value.body.message);
          console.log(value, 'success');
        },
        error: (value) => {
          console.log(value, 'error');
          this.notification.addError(value.error.message);
        },
      })
    );
  }
}
