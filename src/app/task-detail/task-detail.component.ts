import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'dmc-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss'],
})
export class TaskDetailComponent implements OnInit, OnDestroy {
  taskId!: string;
  date!: Date;
  taskForm!: FormGroup;
  submitted = false;
  isEditForm!: boolean;
  isViewForm!: boolean;
  titleFromAPI!: string;
  descriptionFromAPI!: string;
  dueDateFromAPI!: string;
  urlSubscription!: Subscription;
  paramMapSubscription!: Subscription;
  constructor(
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private task: TaskService
  ) {}
  ngOnInit(): void {
    console.log(this.activeRoute.url);

    this.paramMapSubscription = this.activeRoute.paramMap.subscribe(
      (params) => {
        console.log(params.get('taskId'));
        const taskIdFromURL = params.get('taskId');
        if (taskIdFromURL !== null) {
          this.taskId = taskIdFromURL;
        }
      }
    );

    this.urlSubscription = this.activeRoute.url.subscribe((value) => {
      console.log(value);
      if (value[0].path === 'create') {
        this.isEditForm = false;
      } else if (value[0].path === 'edit') {
        this.isEditForm = true;
        this.getTask(this.taskId);
      } else {
        this.isViewForm = true;
        this.getTask(this.taskId);
      }
      this.date = new Date();
      console.log(this.date.toISOString().slice(0, 10));
    });

    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: [new Date().toISOString().slice(0, 10), Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.taskForm.invalid) {
      return;
    }
    console.log('Form Submitted');
    console.log(this.taskForm.value);
    const { title, description, dueDate } = this.taskForm.value;
    if (this.isEditForm) {
      this.task.updateTask(this.taskId, title, description, dueDate);
      return;
    }
    this.task.addTask(title, description, dueDate);
  }

  get taskFormControl() {
    return this.taskForm.controls;
  }

  getTask(id: string) {
    this.task.getTask(id).subscribe((response) => {
      this.taskFormControl['title'].setValue(response.result.title);
      this.taskFormControl['description'].setValue(response.result.description);
      this.taskFormControl['dueDate'].setValue(
        response.result.dueDate.slice(0, 10)
      );
      // this.titleFromAPI = response.title;
      // this.descriptionFromAPI = response.description;
      // this.dueDateFromAPI = response.dueDate;
    });
  }

  ngOnDestroy(): void {
    this.paramMapSubscription && this.paramMapSubscription.unsubscribe();
    this.urlSubscription && this.urlSubscription.unsubscribe();
  }
}
