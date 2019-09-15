import { Component, OnInit } from '@angular/core';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css']
})
export class SignupFormComponent implements OnInit {
  submitted = false;
  errorMsg = '';
  userModel = new User('', '', '', '');


  onSubmit() {
    this.submitted = true;
    if (this.userModel.role === '') {
      this.userModel.role = '0'
    }
      this._authService.registerUser(this.userModel).subscribe(
        data => {
          console.log('Success', data)
          localStorage.setItem('token', data.token)
          localStorage.setItem('role', data.role)
          location.reload();
          this._router.navigate(['/order'])
        },
        error => this.errorMsg = error.statusText
      )
  }

  constructor(private _authService: AuthService, private _router: Router) { }

  ngOnInit() {
  }

}
