import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../../services/reserva-service';
import { ClienteService } from '../../services/cliente-service';
import { CampoService } from '../../services/campo-service';
import { ActividadService } from '../../services/actividad-service';
import { UsuarioService } from '../../services/usuario-service';
import { Reserva } from '../../model/reserva';
import { Cliente } from '../../model/cliente';
import { Campo } from '../../model/campo';
import { Actividad } from '../../model/actividad';
import { Usuario } from '../../model/usuario';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './reserva-component.html',
  styleUrl: './reserva-component.css',
})
export class ReservaComponent implements OnInit {
  reservas: Reserva[] = [];
  nuevaReserva: Reserva = this.inicializarReserva();
  mensajeError: string = '';
  tipoMensaje: 'error' | 'success' | '' = '';
  modoEdicion: boolean = false;

  // Listas para los selects
  clientes: Cliente[] = [];
  campos: Campo[] = [];
  actividades: Actividad[] = [];
  usuarios: Usuario[] = [];

  constructor(
    private reservaService: ReservaService,
    private clienteService: ClienteService,
    private campoService: CampoService,
    private actividadService: ActividadService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.cargarReservas();
    this.cargarClientes();
    this.cargarCampos();
    this.cargarActividades();
    this.cargarUsuarios();
  }

  cargarReservas(): void {
    this.reservaService.findAll().subscribe({
      next: (data) => {
        this.reservas = data;
        console.log('Reservas cargadas:', this.reservas);
      },
      error: (error) => {
        console.error('Error al cargar reservas:', error);
      },
    });
  }

  cargarClientes(): void {
    this.clienteService.findAll().subscribe({
      next: (data) => {
        this.clientes = data;
        console.log('Clientes cargados:', this.clientes);
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
      },
    });
  }

  cargarCampos(): void {
    this.campoService.findAll().subscribe({
      next: (data) => {
        this.campos = data;
        console.log('Campos cargados:', this.campos);
      },
      error: (error) => {
        console.error('Error al cargar campos:', error);
      },
    });
  }

  cargarActividades(): void {
    this.actividadService.findAll().subscribe({
      next: (data) => {
        this.actividades = data;
        console.log('Actividades cargadas:', this.actividades);
      },
      error: (error) => {
        console.error('Error al cargar actividades:', error);
      },
    });
  }

  cargarUsuarios(): void {
    this.usuarioService.findAll().subscribe({
      next: (data) => {
        this.usuarios = data;
        console.log('Usuarios cargados:', this.usuarios);
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
      },
    });
  }

  inicializarReserva(): Reserva {
    return {
      idReserva: 0,
      cliente: {
        idCliente: 0,
        nombre: '',
        apellido: '',
        dni: '',
        telefono: '',
        correo: '',
        fechaRegistro: '',
      },
      campo: {
        idCampo: 0,
        nombre: '',
        precioPorHora: 0,
        estado: '',
        descripcion: '',
      },
      actividad: {
        idActividad: 0,
        nombre: '',
        descripcion: '',
      },
      fechaReserva: '',
      horaInicio: '',
      duracionHoras: 1,
      montoTotal: 0,
      usuario: {
        idUsuario: 0,
        nombreUsuario: '',
        correo: '',
        password: '',
        fechaCreacion: '',
        rol: '',
        dni: '',
        telefono: '',
        nombre: '',
        apellido: '',
        estado: true,
      },
      estado: 'PENDIENTE',
      fechaCreacion: '',
    };
  }

  calcularMontoTotal(): void {
    const campoSeleccionado = this.campos.find(
      (c) => c.idCampo === Number(this.nuevaReserva.campo.idCampo)
    );
    
    if (campoSeleccionado && this.nuevaReserva.duracionHoras > 0) {
      this.nuevaReserva.montoTotal =
        campoSeleccionado.precioPorHora * this.nuevaReserva.duracionHoras;
    } else {
      this.nuevaReserva.montoTotal = 0;
    }
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

    // Validar cliente
    if (!this.nuevaReserva.cliente.idCliente || this.nuevaReserva.cliente.idCliente === 0) {
      this.mostrarError('Debe seleccionar un cliente');
      return false;
    }

    // Validar campo
    if (!this.nuevaReserva.campo.idCampo || this.nuevaReserva.campo.idCampo === 0) {
      this.mostrarError('Debe seleccionar un campo');
      return false;
    }

    // Validar actividad
    if (!this.nuevaReserva.actividad.idActividad || this.nuevaReserva.actividad.idActividad === 0) {
      this.mostrarError('Debe seleccionar una actividad');
      return false;
    }

    // Validar usuario
    if (!this.nuevaReserva.usuario.idUsuario || this.nuevaReserva.usuario.idUsuario === 0) {
      this.mostrarError('Debe seleccionar un usuario');
      return false;
    }

    // Validar fecha
    if (!this.nuevaReserva.fechaReserva) {
      this.mostrarError('La fecha de reserva es obligatoria');
      return false;
    }

    // Validar hora
    if (!this.nuevaReserva.horaInicio) {
      this.mostrarError('La hora de inicio es obligatoria');
      return false;
    }

    // Validar duración
    if (!this.nuevaReserva.duracionHoras || this.nuevaReserva.duracionHoras <= 0) {
      this.mostrarError('La duración debe ser mayor a 0');
      return false;
    }

    // Validar monto
    if (!this.nuevaReserva.montoTotal || this.nuevaReserva.montoTotal <= 0) {
      this.mostrarError('El monto total debe ser mayor a 0');
      return false;
    }

    // Validar estado
    if (!this.nuevaReserva.estado) {
      this.mostrarError('El estado es obligatorio');
      return false;
    }

    return true;
  }

  guardarReserva(): void {
    if (!this.validarFormulario()) {
      return;
    }

    if (this.modoEdicion) {
      this.actualizarReserva();
    } else {
      this.crearReserva();
    }
  }

  crearReserva(): void {
    // Preparar el DTO con solo los IDs de las relaciones
    const reservaDTO: any = {
      cliente: { idCliente: Number(this.nuevaReserva.cliente.idCliente) },
      campo: { idCampo: Number(this.nuevaReserva.campo.idCampo) },
      actividad: { idActividad: Number(this.nuevaReserva.actividad.idActividad) },
      usuario: { idUsuario: Number(this.nuevaReserva.usuario.idUsuario) },
      fechaReserva: this.nuevaReserva.fechaReserva,
      horaInicio: this.nuevaReserva.horaInicio,
      duracionHoras: Number(this.nuevaReserva.duracionHoras),
      montoTotal: Number(this.nuevaReserva.montoTotal),
      estado: this.nuevaReserva.estado,
    };

    console.log('Enviando reserva:', reservaDTO);

    this.reservaService.save(reservaDTO).subscribe({
      next: (response) => {
        console.log('Reserva guardada:', response);
        this.mostrarExito('Reserva creada exitosamente');

        setTimeout(() => {
          this.cargarReservas();
          this.nuevaReserva = this.inicializarReserva();
          this.cerrarModal();
          this.limpiarMensaje();
        }, 1500);
      },
      error: (error) => {
        this.manejarError(error);
      },
    });
  }

  actualizarReserva(): void {
    if (!this.nuevaReserva.idReserva) {
      this.mostrarError('Error: No se puede actualizar sin ID de reserva');
      return;
    }

    // Preparar el DTO con solo los IDs de las relaciones
    const reservaDTO: any = {
      cliente: { idCliente: Number(this.nuevaReserva.cliente.idCliente) },
      campo: { idCampo: Number(this.nuevaReserva.campo.idCampo) },
      actividad: { idActividad: Number(this.nuevaReserva.actividad.idActividad) },
      usuario: { idUsuario: Number(this.nuevaReserva.usuario.idUsuario) },
      fechaReserva: this.nuevaReserva.fechaReserva,
      horaInicio: this.nuevaReserva.horaInicio,
      duracionHoras: Number(this.nuevaReserva.duracionHoras),
      montoTotal: Number(this.nuevaReserva.montoTotal),
      estado: this.nuevaReserva.estado,
    };

    console.log('Actualizando reserva ID:', this.nuevaReserva.idReserva);
    console.log('DTO a enviar:', reservaDTO);

    this.reservaService.update(this.nuevaReserva.idReserva, reservaDTO).subscribe({
      next: (response) => {
        console.log('Reserva actualizada exitosamente');
        this.mostrarExito('Reserva actualizada exitosamente');

        setTimeout(() => {
          this.cargarReservas();
          this.nuevaReserva = this.inicializarReserva();
          this.modoEdicion = false;
          this.cerrarModal();
          this.limpiarMensaje();
        }, 1500);
      },
      error: (error) => {
        this.manejarError(error);
      },
    });
  }

  manejarError(error: any): void {
    console.error('Error completo:', error);

    let mensajeError = 'Error al procesar la solicitud';

    if (error.status === 400) {
      if (error.error?.message) {
        mensajeError = error.error.message;
      } else if (typeof error.error === 'string') {
        mensajeError = error.error;
      } else {
        mensajeError = 'Datos inválidos. Verifique la información ingresada.';
      }
    } else if (error.status === 404) {
      mensajeError = 'Reserva no encontrada.';
    } else if (error.status === 409) {
      mensajeError = 'Conflicto con otra reserva. El campo podría estar ocupado en ese horario.';
    } else if (error.status === 500) {
      const errorMessage = error.error?.message || '';

      if (errorMessage.toLowerCase().includes('campo') && 
          errorMessage.toLowerCase().includes('ocupado')) {
        mensajeError = 'El campo ya está reservado para ese horario.';
      } else if (errorMessage.toLowerCase().includes('disponibilidad')) {
        mensajeError = 'No hay disponibilidad para el horario seleccionado.';
      } else {
        mensajeError = 'Error del servidor. Verifique los datos ingresados.';
      }
    } else if (error.status === 0) {
      mensajeError = 'No se pudo conectar con el servidor. Verifique su conexión.';
    }

    this.mostrarError(mensajeError);
  }

  abrirModalEditar(reserva: Reserva): void {
    this.modoEdicion = true;
    this.nuevaReserva = { ...reserva };
    this.limpiarMensaje();

    // Abrir modal programáticamente
    const modalElement = document.getElementById('modalAgregar');
    const modal = new (window as any).bootstrap.Modal(modalElement);
    modal.show();
  }

  eliminarReserva(reserva: Reserva): void {
    const confirmar = confirm(
      `¿Está seguro de eliminar la reserva #${reserva.idReserva}?\n\n` +
        `Cliente: ${reserva.cliente.nombre} ${reserva.cliente.apellido}\n` +
        `Campo: ${reserva.campo.nombre}\n` +
        `Fecha: ${reserva.fechaReserva}\n` +
        `Hora: ${reserva.horaInicio}\n\n` +
        `Esta acción no se puede deshacer.`
    );

    if (!confirmar) {
      return;
    }

    this.reservaService.delete(reserva.idReserva).subscribe({
      next: () => {
        console.log('Reserva eliminada:', reserva.idReserva);
        alert('Reserva eliminada exitosamente');
        this.cargarReservas();
      },
      error: (error) => {
        console.error('Error al eliminar reserva:', error);

        let mensajeError = 'Error al eliminar la reserva';

        if (error.status === 404) {
          mensajeError = 'Reserva no encontrada.';
        } else if (error.status === 500) {
          mensajeError = 'Error del servidor. La reserva podría estar relacionada con otros registros.';
        } else if (error.status === 0) {
          mensajeError = 'No se pudo conectar con el servidor.';
        }

        alert(mensajeError);
      },
    });
  }

  cerrarModal(): void {
    const modalElement = document.getElementById('modalAgregar');
    const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }

    // Limpiar el formulario y mensajes al cerrar
    this.nuevaReserva = this.inicializarReserva();
    this.modoEdicion = false;
    this.limpiarMensaje();
  }

  abrirModal(): void {
    this.modoEdicion = false;
    this.nuevaReserva = this.inicializarReserva();
    this.limpiarMensaje();
  }
}