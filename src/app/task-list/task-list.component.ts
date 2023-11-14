import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SortValue, Task } from '../interfaces/task.interface';
import { AuthService } from '../services/auth.service';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'dmc-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  postsPerPage = 10;
  currentPage = 1;
  tasks$!: Observable<{ tasks: Task[]; taskCount: number }>;
  authStatus$!: Observable<boolean>;
  userId!: string;
  sortValue: SortValue = 'default';

  constructor(
    private task: TaskService,
    private auth: AuthService
  ) {}
  sortValues: SortValue[] = ['default', 'ascending', 'descending'];
  isMyTask = true;
  ngOnInit(): void {
    this.userId = this.auth.userId!;
    this.authStatus$ = this.auth.authStatus$.pipe(
      map((authStatus) => !!authStatus)
    );
    this.task.getTasks(this.postsPerPage, this.currentPage);
    this.tasks$ = this.task.tasks$;
  }

  onTaskDelete(id: string) {
    this.task.deleteTask(id).subscribe(() => {
      this.task.getTasks(this.postsPerPage, this.currentPage);
    });
  }

  onSort(event: Event) {
    const sortValue = (event.target as HTMLSelectElement).value;
    this.sortValue = sortValue as SortValue;
  }
}
