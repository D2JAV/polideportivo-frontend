import { Component, OnInit } from '@angular/core'; 
import { RouterLink } from '@angular/router';  
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario-service';
import { Usuario } from '../../model/usuario';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [ 
    RouterLink,
    CommonModule,
    FormsModule
  ],
  templateUrl: './usuarios-component.html',
  styleUrl: './usuarios-component.css',
})
export class UsuarioComponent implements OnInit {
  usuarios: Usuario[] = [];
  nuevoUsuario: Usuario = this.inicializarUsuario();
  usuarioEditando: Usuario | null = null;
  mensajeError: string = '';
  tipoMensaje: 'error' | 'success' | '' = '';
  modoEdicion: boolean = false;
  passwordOriginal: string = '';

  constructor(
    private usuarioService: UsuarioService
  ) {}
  
  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.findAll().subscribe({
      next: (data) => {
        this.usuarios = data;
        console.log('Usuarios cargados:', this.usuarios);
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    });
  }

  inicializarUsuario(): Usuario {
    return {
      idUsuario: 0,
      nombreUsuario: '',
      correo: '',
      password: '',
      fechaCreacion: '',
      rol: 'TRABAJADOR',
      dni: '',
      telefono: '',
      nombre: '',
      apellido: '',
      estado: true
    };
  }

  limpiarMensaje(): void {
    this.mensajeError = '';
    this.tipoMensaje = '';
  }

  mostrarError(mensaje: string): void {
    this.mensajeError = mensaje;
    this.tipoMensaje = 'error';
  }

  mostrarExito(mensaje: string): void {
    this.mensajeError = mensaje;
    this.tipoMensaje = 'success';
  }

  validarFormulario(): boolean {
    this.limpiarMensaje();

    // Validar campos obligatorios
    if (!this.nuevoUsuario.nombreUsuario?.trim()) {
      this.mostrarError('El nombre de usuario es obligatorio');
      return false;
    }

    if (!this.nuevoUsuario.correo?.trim()) {
      this.mostrarError('El correo electrónico es obligatorio');
      return false;
    }

    // Validar password solo si no es edición o si se está cambiando
    if (!this.modoEdicion && !this.nuevoUsuario.password) {
      this.mostrarError('La contraseña es obligatoria');
      return false;
    }

    if (!this.nuevoUsuario.nombre?.trim()) {
      this.mostrarError('El nombre es obligatorio');
      return false;
    }

    if (!this.nuevoUsuario.apellido?.trim()) {
      this.mostrarError('El apellido es obligatorio');
      return false;
    }

    if (!this.nuevoUsuario.dni) {
      this.mostrarError('El DNI es obligatorio');
      return false;
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.nuevoUsuario.correo)) {
      this.mostrarError('El correo electrónico no es válido');
      return false;
    }

    // Validar DNI (8 dígitos numéricos)
    const dniString = String(this.nuevoUsuario.dni);
    const dniRegex = /^\d{8}$/;
    if (!dniRegex.test(dniString)) {
      this.mostrarError('El DNI debe tener exactamente 8 dígitos');
      return false;
    }

    // Validar contraseña si se proporciona
    if (this.nuevoUsuario.password && this.nuevoUsuario.password.length < 6) {
      this.mostrarError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    // Validar teléfono si se proporciona
    if (this.nuevoUsuario.telefono) {
      const telefonoString = String(this.nuevoUsuario.telefono);
      const telefonoRegex = /^\d{9}$/;
      if (!telefonoRegex.test(telefonoString)) {
        this.mostrarError('El teléfono debe tener 9 dígitos');
        return false;
      }
    }

    return true;
  }

  guardarUsuario(): void {
    // Validar formulario
    if (!this.validarFormulario()) {
      return;
    }

    if (this.modoEdicion) {
      this.actualizarUsuario();
    } else {
      this.crearUsuario();
    }
  }

  crearUsuario(): void {
    // Preparar el objeto a enviar
    const usuarioDTO: any = {
      nombreUsuario: this.nuevoUsuario.nombreUsuario.trim(),
      correo: this.nuevoUsuario.correo.trim().toLowerCase(),
      password: this.nuevoUsuario.password,
      rol: this.nuevoUsuario.rol,
      dni: String(this.nuevoUsuario.dni),
      telefono: this.nuevoUsuario.telefono ? String(this.nuevoUsuario.telefono) : null,
      nombre: this.nuevoUsuario.nombre.trim(),
      apellido: this.nuevoUsuario.apellido.trim(),
      estado: this.nuevoUsuario.estado
    };

    console.log('Enviando usuario:', usuarioDTO);

    this.usuarioService.save(usuarioDTO).subscribe({
      next: (response) => {
        console.log('Usuario guardado:', response);
        this.mostrarExito('Usuario creado exitosamente');
        
        setTimeout(() => {
          this.cargarUsuarios();
          this.nuevoUsuario = this.inicializarUsuario();
          this.cerrarModal();
          this.limpiarMensaje();
        }, 1500);
      },
      error: (error) => {
        this.manejarError(error);
      }
    });
  }

  actualizarUsuario(): void {
    if (!this.nuevoUsuario.idUsuario) {
      this.mostrarError('Error: No se puede actualizar sin ID de usuario');
      return;
    }

    // Preparar el objeto a enviar (SIN idUsuario ni fechaCreacion)
    const usuarioDTO: any = {
      nombreUsuario: this.nuevoUsuario.nombreUsuario.trim(),
      correo: this.nuevoUsuario.correo.trim().toLowerCase(),
      rol: this.nuevoUsuario.rol,
      dni: String(this.nuevoUsuario.dni),
      telefono: this.nuevoUsuario.telefono ? String(this.nuevoUsuario.telefono) : null,
      nombre: this.nuevoUsuario.nombre.trim(),
      apellido: this.nuevoUsuario.apellido.trim(),
      estado: this.nuevoUsuario.estado
    };

    // Manejar la contraseña:
    // Si el usuario ingresó una nueva, usar esa
    // Si dejó el campo vacío, usar la contraseña original
    if (this.nuevoUsuario.password && this.nuevoUsuario.password.trim()) {
      usuarioDTO.password = this.nuevoUsuario.password.trim();
    } else {
      usuarioDTO.password = this.passwordOriginal;
    }

    console.log('Actualizando usuario ID:', this.nuevoUsuario.idUsuario);
    console.log('DTO a enviar:', { ...usuarioDTO, password: '***' }); // Ocultar password en log

    this.usuarioService.update(this.nuevoUsuario.idUsuario, usuarioDTO).subscribe({
      next: (response) => {
        console.log('Usuario actualizado exitosamente');
        this.mostrarExito('Usuario actualizado exitosamente');
        
        setTimeout(() => {
          this.cargarUsuarios();
          this.nuevoUsuario = this.inicializarUsuario();
          this.modoEdicion = false;
          this.passwordOriginal = '';
          this.cerrarModal();
          this.limpiarMensaje();
        }, 1500);
      },
      error: (error) => {
        this.manejarError(error);
      }
    });
  }

  manejarError(error: any): void {
    console.error('Error completo:', error);
    
    let mensajeError = 'Error al procesar la solicitud';
    
    // Manejar diferentes tipos de errores
    if (error.status === 400) {
      if (error.error?.message) {
        mensajeError = error.error.message;
      } else if (typeof error.error === 'string') {
        mensajeError = error.error;
      } else {
        mensajeError = 'Datos inválidos. Verifique la información ingresada.';
      }
    } else if (error.status === 404) {
      mensajeError = 'Usuario no encontrado.';
    } else if (error.status === 409) {
      mensajeError = 'El correo, DNI o nombre de usuario ya están registrados.';
    } else if (error.status === 500) {
      const errorMessage = error.error?.message || '';
      
      if (errorMessage.toLowerCase().includes('correo') || 
          errorMessage.toLowerCase().includes('email')) {
        mensajeError = 'El correo electrónico ya está registrado.';
      } else if (errorMessage.toLowerCase().includes('dni')) {
        mensajeError = 'El DNI ya está registrado.';
      } else if (errorMessage.toLowerCase().includes('usuario') ||
                 errorMessage.toLowerCase().includes('username')) {
        mensajeError = 'El nombre de usuario ya está registrado.';
      } else if (errorMessage.toLowerCase().includes('duplicate') ||
                 errorMessage.toLowerCase().includes('duplicado')) {
        mensajeError = 'Ya existe un usuario con estos datos. Verifique el correo, DNI o nombre de usuario.';
      } else {
        mensajeError = 'Error del servidor. El correo, DNI o nombre de usuario podrían estar duplicados.';
      }
    } else if (error.status === 0) {
      mensajeError = 'No se pudo conectar con el servidor. Verifique su conexión.';
    }
    
    this.mostrarError(mensajeError);
  }

  abrirModalEditar(usuario: Usuario): void {
    this.modoEdicion = true;
    this.nuevoUsuario = { ...usuario }; // Clonar el usuario
    this.passwordOriginal = usuario.password; // Guardar password original
    this.nuevoUsuario.password = ''; // Limpiar el campo para que el usuario sepa que debe escribir una nueva si quiere cambiarla
    this.limpiarMensaje();
    
    // Abrir modal programáticamente
    const modalElement = document.getElementById('modalAgregar');
    const modal = new (window as any).bootstrap.Modal(modalElement);
    modal.show();
  }

  eliminarUsuario(usuario: Usuario): void {
    const confirmar = confirm(
      `¿Está seguro de eliminar al usuario "${usuario.nombre} ${usuario.apellido}"?\n\n` +
      `DNI: ${usuario.dni}\n` +
      `Correo: ${usuario.correo}\n\n` +
      `Esta acción no se puede deshacer.`
    );

    if (!confirmar) {
      return;
    }

    this.usuarioService.delete(usuario.idUsuario).subscribe({
      next: () => {
        console.log('Usuario eliminado:', usuario.idUsuario);
        alert('Usuario eliminado exitosamente');
        this.cargarUsuarios();
      },
      error: (error) => {
        console.error('Error al eliminar usuario:', error);
        
        let mensajeError = 'Error al eliminar el usuario';
        
        if (error.status === 404) {
          mensajeError = 'Usuario no encontrado.';
        } else if (error.status === 500) {
          mensajeError = 'Error del servidor. El usuario podría estar relacionado con otros registros.';
        } else if (error.status === 0) {
          mensajeError = 'No se pudo conectar con el servidor.';
        }
        
        alert(mensajeError);
      }
    });
  }

  cerrarModal(): void {
    const modalElement = document.getElementById('modalAgregar');
    const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
    
    // Limpiar el formulario y mensajes al cerrar
    this.nuevoUsuario = this.inicializarUsuario();
    this.modoEdicion = false;
    this.passwordOriginal = '';
    this.limpiarMensaje();
  }

  abrirModal(): void {
    this.modoEdicion = false;
    this.nuevoUsuario = this.inicializarUsuario();
    this.limpiarMensaje();
  }
}