import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationsService, Command } from '../notifications.service';

@Component({
  selector: 'dmc-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
})
export class NotificationListComponent {
  messages$: Observable<Command[]>;

  constructor(private notificationsService: NotificationsService) {
    this.messages$ = this.notificationsService.messageInputArr$;
  }

  clearMessage(id: number) {
    this.notificationsService.clearMesssage(id);
  }
}
