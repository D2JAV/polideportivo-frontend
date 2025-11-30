import { Component, OnInit } from '@angular/core'; 
import { RouterLink } from '@angular/router';  
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente-service';
import { Cliente } from '../../model/cliente';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [ 
    RouterLink,
    CommonModule,
    FormsModule
  ],
  templateUrl: './clientes-component.html',
  styleUrl: './clientes-component.css',
})
export class ClienteComponent implements OnInit {
  clientes: Cliente[] = [];
  nuevoCliente: Cliente = this.inicializarCliente();
  mensajeError: string = '';
  tipoMensaje: 'error' | 'success' | '' = '';
  modoEdicion: boolean = false;

  constructor(
    private clienteService: ClienteService
  ) {}
  
  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.clienteService.findAll().subscribe({
      next: (data) => {
        this.clientes = data;
        console.log('Clientes cargados:', this.clientes);
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
      }
    });
  }

  inicializarCliente(): Cliente {
    return {
      idCliente: 0,
      nombre: '',
      apellido: '',
      dni: '',
      telefono: '',
      correo: '',
      fechaRegistro: ''
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
    if (!this.nuevoCliente.nombre?.trim()) {
      this.mostrarError('El nombre es obligatorio');
      return false;
    }

    if (!this.nuevoCliente.apellido?.trim()) {
      this.mostrarError('El apellido es obligatorio');
      return false;
    }

    if (!this.nuevoCliente.dni) {
      this.mostrarError('El DNI es obligatorio');
      return false;
    }

    if (!this.nuevoCliente.correo?.trim()) {
      this.mostrarError('El correo electrónico es obligatorio');
      return false;
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.nuevoCliente.correo)) {
      this.mostrarError('El correo electrónico no es válido');
      return false;
    }

    // Validar DNI (8 dígitos numéricos)
    const dniString = String(this.nuevoCliente.dni);
    const dniRegex = /^\d{8}$/;
    if (!dniRegex.test(dniString)) {
      this.mostrarError('El DNI debe tener exactamente 8 dígitos');
      return false;
    }

    // Validar teléfono si se proporciona
    if (this.nuevoCliente.telefono) {
      const telefonoString = String(this.nuevoCliente.telefono);
      const telefonoRegex = /^\d{9}$/;
      if (!telefonoRegex.test(telefonoString)) {
        this.mostrarError('El teléfono debe tener 9 dígitos');
        return false;
      }
    }

    return true;
  }

  guardarCliente(): void {
    // Validar formulario
    if (!this.validarFormulario()) {
      return;
    }

    if (this.modoEdicion) {
      this.actualizarCliente();
    } else {
      this.crearCliente();
    }
  }

  crearCliente(): void {
    // Preparar el objeto a enviar
    const clienteDTO: any = {
      nombre: this.nuevoCliente.nombre.trim(),
      apellido: this.nuevoCliente.apellido.trim(),
      dni: String(this.nuevoCliente.dni),
      telefono: this.nuevoCliente.telefono ? String(this.nuevoCliente.telefono) : null,
      correo: this.nuevoCliente.correo.trim().toLowerCase()
    };

    console.log('Enviando cliente:', clienteDTO);

    this.clienteService.save(clienteDTO).subscribe({
      next: (response) => {
        console.log('Cliente guardado:', response);
        this.mostrarExito('Cliente creado exitosamente');
        
        setTimeout(() => {
          this.cargarClientes();
          this.nuevoCliente = this.inicializarCliente();
          this.cerrarModal();
          this.limpiarMensaje();
        }, 1500);
      },
      error: (error) => {
        this.manejarError(error);
      }
    });
  }

  actualizarCliente(): void {
    if (!this.nuevoCliente.idCliente) {
      this.mostrarError('Error: No se puede actualizar sin ID de cliente');
      return;
    }

    // Preparar el objeto a enviar
    const clienteDTO: any = {
      nombre: this.nuevoCliente.nombre.trim(),
      apellido: this.nuevoCliente.apellido.trim(),
      dni: String(this.nuevoCliente.dni),
      telefono: this.nuevoCliente.telefono ? String(this.nuevoCliente.telefono) : null,
      correo: this.nuevoCliente.correo.trim().toLowerCase()
    };

    console.log('Actualizando cliente ID:', this.nuevoCliente.idCliente);
    console.log('DTO a enviar:', clienteDTO);

    this.clienteService.update(this.nuevoCliente.idCliente, clienteDTO).subscribe({
      next: (response) => {
        console.log('Cliente actualizado exitosamente');
        this.mostrarExito('Cliente actualizado exitosamente');
        
        setTimeout(() => {
          this.cargarClientes();
          this.nuevoCliente = this.inicializarCliente();
          this.modoEdicion = false;
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
      mensajeError = 'Cliente no encontrado.';
    } else if (error.status === 409) {
      mensajeError = 'El correo o DNI ya están registrados.';
    } else if (error.status === 500) {
      const errorMessage = error.error?.message || '';
      
      if (errorMessage.toLowerCase().includes('correo') || 
          errorMessage.toLowerCase().includes('email')) {
        mensajeError = 'El correo electrónico ya está registrado.';
      } else if (errorMessage.toLowerCase().includes('dni')) {
        mensajeError = 'El DNI ya está registrado.';
      } else if (errorMessage.toLowerCase().includes('duplicate') ||
                 errorMessage.toLowerCase().includes('duplicado')) {
        mensajeError = 'Ya existe un cliente con estos datos. Verifique el correo o DNI.';
      } else {
        mensajeError = 'Error del servidor. El correo o DNI podrían estar duplicados.';
      }
    } else if (error.status === 0) {
      mensajeError = 'No se pudo conectar con el servidor. Verifique su conexión.';
    }
    
    this.mostrarError(mensajeError);
  }

  abrirModalEditar(cliente: Cliente): void {
    this.modoEdicion = true;
    this.nuevoCliente = { ...cliente }; // Clonar el cliente
    this.limpiarMensaje();
    
    // Abrir modal programáticamente
    const modalElement = document.getElementById('modalAgregar');
    const modal = new (window as any).bootstrap.Modal(modalElement);
    modal.show();
  }

  eliminarCliente(cliente: Cliente): void {
    const confirmar = confirm(
      `¿Está seguro de eliminar al cliente "${cliente.nombre} ${cliente.apellido}"?\n\n` +
      `DNI: ${cliente.dni}\n` +
      `Correo: ${cliente.correo}\n\n` +
      `Esta acción no se puede deshacer.`
    );

    if (!confirmar) {
      return;
    }

    this.clienteService.delete(cliente.idCliente).subscribe({
      next: () => {
        console.log('Cliente eliminado:', cliente.idCliente);
        alert('Cliente eliminado exitosamente');
        this.cargarClientes();
      },
      error: (error) => {
        console.error('Error al eliminar cliente:', error);
        
        let mensajeError = 'Error al eliminar el cliente';
        
        if (error.status === 404) {
          mensajeError = 'Cliente no encontrado.';
        } else if (error.status === 500) {
          mensajeError = 'Error del servidor. El cliente podría estar relacionado con otros registros.';
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
    this.nuevoCliente = this.inicializarCliente();
    this.modoEdicion = false;
    this.limpiarMensaje();
  }

  abrirModal(): void {
    this.modoEdicion = false;
    this.nuevoCliente = this.inicializarCliente();
    this.limpiarMensaje();
  }
}