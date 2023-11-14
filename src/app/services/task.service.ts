import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Task } from '../interfaces/task.interface';

const BACKEND_TASK_URL = `${environment.apiUrl}/task`;

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: Task[] = [];
  private tasksSubj = new Subject<{ tasks: Task[]; taskCount: number }>();
  readonly tasks$ = this.tasksSubj.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  getTasks(tasksPerPage?: number, currentPage?: number) {
    const queryParams = `?pageSize=${tasksPerPage}&page=${currentPage}`;
    this.http
      .get<any>(BACKEND_TASK_URL + queryParams)
      .pipe(
        map((taskData) => {
          console.log(taskData, 'taskData');
          return {
            tasks: taskData.result.tasks.map((task: any) => {
              console.log(task, 'task');
              return {
                title: task.title,
                description: task.description,
                dueDate: task.dueDate,
                creator: task.creator,
                username: task.username,
                id: task._id,
              };
            }),
            maxTasks: taskData.result.maxTasks,
          };
        })
      )
      .subscribe((transformedTaskData) => {
        this.tasks = transformedTaskData.tasks;
        this.tasksSubj.next({
          tasks: [...this.tasks],
          taskCount: transformedTaskData.maxTasks,
        });
      });
  }

  getTask(id: string) {
    return this.http.get<any>(`${BACKEND_TASK_URL}/${id}`);
  }

  addTask(title: string, description: string, dueDate: string) {
    const taskData = {
      title,
      description,
      dueDate,
    };
    this.http.post<any>(BACKEND_TASK_URL, taskData).subscribe((_) => {
      this.router.navigate(['/', 'tasks']);
    });
  }

  updateTask(id: string, title: string, description: string, dueDate: string) {
    const taskData: Task = {
      id,
      title,
      description,
      dueDate,
    };
    this.http.put(`${BACKEND_TASK_URL}/${id}`, taskData).subscribe((_) => {
      this.router.navigate(['/', 'tasks']);
    });
  }

  deleteTask(taskId: string) {
    return this.http.delete(`${BACKEND_TASK_URL}/${taskId}`);
  }
}
