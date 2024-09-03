import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLogin: boolean = true;
  isPasswordVisible: boolean = false;
  password: string = "";
  username: string = "";
  loginErrorMessage: string = "";
  registerErrorMessage: string = "";

  ngOnInit(){
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/chat']);
    }
  }

  constructor(private authService: AuthService, private router: Router){}

  switchMode(){
    this.isLogin = !this.isLogin;
  }

  togglePasswordVisibility(){
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit(){
    if(this.isLogin){
      this.authService.login(this.username, this.password).subscribe(
        response=> {
          console.log('Login successful', response);
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', response.username);
          this.router.navigate(['/chat']);
        },
        error => {
          this.loginErrorMessage = "User data is incorrect.";
          console.error('Login failed', error);
        }
      );
    }
    else{
      this.authService.register(this.username, this.password).subscribe(
        response => {
          console.log('Registration successful', response);
          this.isLogin = true;
        },
        error => {
          this.registerErrorMessage = "Registration failed, please try again.";
          console.error('Registration failed', error);
        }
      );
    }
  }

}
