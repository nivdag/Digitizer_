import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  submitted = false;
  errorMsg = '';
  userModel = new User('', '', '', '');

  onSubmit() {
    this.submitted = true;
    this._authService.loginUser(this.userModel).subscribe(
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
