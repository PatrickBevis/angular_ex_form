import { Component, Input } from '@angular/core';
import { UserForm } from '../user-form/user-form';
import { UserCard } from '../user-card/user-card';
import User from '../../models/user.model';

@Component({
  selector: 'app-register-page',
  imports: [UserForm,UserCard],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {

  @Input() users: User[] = [];
  
  onRegister(user: any) {
    this.users.push(user);
  }

  get registeredUsers() {
    return this.users;
  }

  deleteUser(userId: number) {
    this.users = this.users.filter(user => user.id !== userId);
  }

}