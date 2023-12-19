import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserListPageComponent } from './pages/user-list-page/user-list-page.component';

// localhost/users/lista
const routes: Routes = [
  {
    path: 'list',
    component: UserListPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
