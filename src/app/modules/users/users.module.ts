import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';

import { UserListPageComponent } from './pages/user-list-page/user-list-page.component';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({
  declarations: [UserListPageComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,

    HttpClientModule,
    NgbModule, // bootstrap
    NgbModalModule, // bootstrap
    ReactiveFormsModule,
    InlineSVGModule,
  ],
})
export class UsersModule {}
