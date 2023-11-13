import { Pipe, PipeTransform } from '@angular/core';
import { Subscription, tap } from 'rxjs';
import { SortValue, Task } from '../interfaces/task.interface';

@Pipe({
  name: 'dateSort',
})
export class DateSortPipe implements PipeTransform {
  subscripition!: Subscription;

  transform(
    tasks: Task[] | undefined,
    sortValue: SortValue
  ): Task[] | undefined {
    console.log('pipe');
    if (tasks && tasks.length !== 0) {
      let sortedTasks = [...tasks];
      if (sortValue === 'ascending') {
        return sortedTasks.sort((a: Task, b: Task) => {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
      } else if (sortValue === 'descending') {
        return sortedTasks.sort((a: Task, b: Task) => {
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        });
      } else {
        return tasks;
      }
    }
    return tasks;
  }
}
