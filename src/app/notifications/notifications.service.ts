import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { scan } from 'rxjs/operators';

export interface Command {
  id: number;
  type: 'success' | 'error' | 'clear';
  text?: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private messagesInputSubj = new Subject<Command>();
  private readonly messagesInput$ = this.messagesInputSubj.asObservable();
  readonly messageInputArr$: Observable<Command[]>;

  constructor() {
    this.messageInputArr$ = this.messagesInput$.pipe(
      scan((acc: Command[], value: Command) => {
        if (value.type === 'clear') {
          return acc.filter((message) => message.id !== value.id);
        } else {
          return [...acc, value];
        }
      }, [])
    );
  }

  addSuccess(message: string) {
    const id = this.randomId();

    this.messagesInputSubj.next({
      id,
      text: message,
      type: 'success',
    });

    setTimeout(() => {
      this.clearMesssage(id);
    }, 2500);
  }

  addError(message: string) {
    const id = this.randomId();

    this.messagesInputSubj.next({
      id,
      text: message,
      type: 'error',
    });

    setTimeout(() => {
      this.clearMesssage(id);
    }, 2500);
  }

  clearMesssage(id: number) {
    this.messagesInputSubj.next({
      id,
      type: 'clear',
    });
  }

  private randomId() {
    return new Date().getTime();
  }
}
