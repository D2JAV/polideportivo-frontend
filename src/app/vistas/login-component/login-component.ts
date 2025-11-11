import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

  ],
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.css'],  
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false

  constructor(private router: Router) {}

  onSubmit() {
    if (!this.username.trim() || !this.password.trim()) {
      alert('Por favor, completa usuario y contraseña');
      return;
    }

    console.log('Login exitoso:', { username: this.username, rememberMe: this.rememberMe });

    
    this.router.navigate(['/dashboard']);
  }
}