import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SignupLoginComponent } from './signup-login/signup-login.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { NavHeaderComponent } from './nav-header/nav-header.component';
import { TaskListComponent } from './task-list/task-list.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthJwtInterceptor } from './interceptors/authjwt.interceptor';
import { DateSortPipe } from './pipes/date-sort.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    SignupLoginComponent,
    TaskDetailComponent,
    NavHeaderComponent,
    TaskListComponent,
    DateSortPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthJwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
