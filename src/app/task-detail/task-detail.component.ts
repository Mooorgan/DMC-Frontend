import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
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
    this.paramMapSubscription = this.activeRoute.paramMap.subscribe(
      (params) => {
        const taskIdFromURL = params.get('taskId');
        if (taskIdFromURL !== null) {
          this.taskId = taskIdFromURL;
        }
      }
    );

    this.urlSubscription = this.activeRoute.url.subscribe((value) => {
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
    });
  }

  ngOnDestroy(): void {
    this.paramMapSubscription && this.paramMapSubscription.unsubscribe();
    this.urlSubscription && this.urlSubscription.unsubscribe();
  }
}
