import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UserAddModalComponent } from '../../components/user-add-modal/user-add-modal.component';

@Component({
  selector: 'app-users-user-list-page',
  templateUrl: './user-list-page.component.html',
  styles: [],
})
export class UserListPageComponent {
  constructor(public modalService: NgbModal) {}

  onNewUser() {
    const userAddModalRef = this.modalService.open(UserAddModalComponent, {
      centered: true,
      size: 'md',
    });
  }
}
