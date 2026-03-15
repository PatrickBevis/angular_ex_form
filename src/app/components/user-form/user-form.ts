import { Component, EventEmitter, inject, Output } from '@angular/core';
import User from '../../models/user.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm {
  formBuilder = inject(FormBuilder);

  users: User[] = [];

  userForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    age: [0, [Validators.required, Validators.min(18)]],
  });

  get name() {
  return this.userForm.get('name')!;
}

get email() {
  return this.userForm.get('email')!;
}

get age() {
  return this.userForm.get('age')!;
}

@Output()

  submitted: boolean = false;

  createUser: EventEmitter<any> = new EventEmitter();

  AddUser() {
    this.createUser.emit(this.userForm.value);
    this.userForm.reset();
    this.submitted;
  }
private resetForm(): void {
    this.userForm.reset();
    this.submitted = false;
  }
  // onSubmit() {
  //   this.submitted = true;
  //   if (this.userForm.invalid) {
  //     return false;
  //   } else {
  //     this.AddUser();
  //     return true;
  //   }
  // }
   public onSubmit(): void {
    this.submitted = true;
    if (this.userForm.valid) {
      this.createUser.emit(this.userForm.value);
      this.resetForm();
    } else {
      console.log('Formulaire invalide');
    }
  }
}
