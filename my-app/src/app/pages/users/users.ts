import { Component } from '@angular/core';
import { AlertDialog } from '../../components/alert-dialog/alert-dialog';

type UsersTy = {
  id: number;
  name: string;
  email: string;
  role: string;
};

@Component({
  selector: 'app-users',
  imports: [AlertDialog],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  constructor() {}

  showAlert = false;
  alertDialog = { title: '', message: '' };
  pendingDeleteId: number | null = null;

  users: UsersTy[] = [
    { id: 1, name: 'John Doe', email: 'test1@gmail.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'test2@gmail.com', role: 'User' },
  ];

  editUser(user: UsersTy) {
    console.log('edit', user);
  }

  confirmDelete(user: UsersTy) {
    this.alertDialog.title = 'Confirm Delete';
    this.alertDialog.message = `Are you sure you want to delete ${user.name}?`;
    this.showAlert = true;
    this.pendingDeleteId = user.id;
  }

  deleteUser(pendingDeleteId: number | null = this.pendingDeleteId) {
    if (pendingDeleteId !== null) {
      this.users = this.users.filter((user) => user.id !== pendingDeleteId);
      this.pendingDeleteId = null;
    }
    this.showAlert = false;
  }

  cancelDelete() {
    this.showAlert = false;
    this.pendingDeleteId = null;
  }
}
