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
onAddUser: EventEmitter<any> = new EventEmitter();

 @Output()
  onUserAdded = new EventEmitter<User>();

  submitted: boolean = false;

  private resetForm(): void {
    this.userForm.reset();
    this.submitted = false;
  }

  public onSubmit(): void {
    this.submitted = true;
    if (this.userForm.valid) {
      const user: User = {
        id: Number(),
        name: this.userForm.value.name,
        email: this.userForm.value.email,
        age: Number(this.userForm.value.age),
      };
      this.onUserAdded.emit(user);
      this.resetForm();
    } else {
      console.log('Formulaire invalide');
    }
  }
  
}