import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { SignupLoginComponent } from './signup-login/signup-login.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TaskListComponent } from './task-list/task-list.component';

const routes: Routes = [
  { path: '', component: SignupLoginComponent },
  { path: 'signup', component: SignupLoginComponent },
  { path: 'tasks', component: TaskListComponent },
  {
    path: 'create',
    component: TaskDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view/:taskId',
    component: TaskDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit/:taskId',
    component: TaskDetailComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
