import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario-service';
import { Router } from '@angular/router';
 import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs/operators'; // Necesario para manejar errores del Observable
import { of } from 'rxjs';
@Component({
  selector: 'app-login',  
  templateUrl: './login-component.html',
  imports: [FormsModule, CommonModule ],
  styleUrls: ['./login-component.css']  
})
export class LoginComponent {

   constructor( 
    private usuarioService: UsuarioService,
    private router: Router // Dirigirnos de un componente a otro
  ) {}



  errorMessage: string | null = null;
  email: string = '';
  password: string = '';
 
  
   iniciarSesion() {
    this.errorMessage = null;  
    
    if (!this.email || !this.password) {
        this.errorMessage = 'Ingrese correo y contraseña';
        return;
    } 

    this.usuarioService.validarCredenciales(this.email, this.password)
      .pipe( 
        catchError(error => {
          console.error('Error de autenticación:', error); 
          if (error.status === 404 || error.status === 401) {
            this.errorMessage = 'Credenciales incorrectas';
          } else {
            this.errorMessage = 'Ocurrió un error inesperado';
          } 
          return of(null);
        })
      )
      .subscribe(usuario => { 
        if (usuario) { 
            this.router.navigate(['home']); 
        } 
      });
  }

}