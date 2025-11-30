import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagoService } from '../../services/pago-service';
import { ReservaService } from '../../services/reserva-service';
import { UsuarioService } from '../../services/usuario-service';
import { Pago } from '../../model/pago';
import { Reserva } from '../../model/reserva';
import { Usuario } from '../../model/usuario';

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './pagos-component.html',
  styleUrl: './pagos-component.css',
})
export class PagoComponent implements OnInit {
  pagos: Pago[] = [];
  nuevoPago: Pago = this.inicializarPago();
  mensajeError: string = '';
  tipoMensaje: 'error' | 'success' | '' = '';
  modoEdicion: boolean = false;

  // Listas para los selects
  reservas: Reserva[] = [];
  usuarios: Usuario[] = [];

  constructor(
    private pagoService: PagoService,
    private reservaService: ReservaService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.cargarPagos();
    this.cargarReservas();
    this.cargarUsuarios();
  }

  cargarPagos(): void {
    this.pagoService.findAll().subscribe({
      next: (data) => {
        this.pagos = data;
        console.log('Pagos cargados:', this.pagos);
      },
      error: (error) => {
        console.error('Error al cargar pagos:', error);
      },
    });
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

  inicializarPago(): Pago {
    return {
      idPago: 0,
      reserva: {
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
        duracionHoras: 0,
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
        estado: '',
        fechaCreacion: '',
      },
      fechaPago: '',
      montoPagado: 0,
      metodoPago: 'EFECTIVO',
      referencia: '',
      estadoPago: 'COMPLETADO',
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
      observaciones: '',
    };
  }

  obtenerNombreCompletoCliente(reserva: Reserva): string {
    return `${reserva.cliente.apellido}, ${reserva.cliente.nombre}`;
  }

  obtenerDetalleReserva(reserva: Reserva): string {
    return `${reserva.campo.nombre} - ${reserva.fechaReserva} - ${reserva.duracionHoras}h`;
  }

  convertirFechaAISO(fecha: string): string {
    // Si ya viene en formato ISO, retornar tal cual
    if (fecha.includes('T')) {
      return fecha;
    }
    
    // Convertir fecha YYYY-MM-DD a formato ISO con hora actual
    const fechaObj = new Date(fecha + 'T00:00:00');
    return fechaObj.toISOString();
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

    // Validar reserva
    if (!this.nuevoPago.reserva.idReserva || this.nuevoPago.reserva.idReserva === 0) {
      this.mostrarError('Debe seleccionar una reserva');
      return false;
    }

    // Validar usuario
    if (!this.nuevoPago.usuario.idUsuario || this.nuevoPago.usuario.idUsuario === 0) {
      this.mostrarError('Debe seleccionar un usuario');
      return false;
    }

    // Validar fecha pago
    if (!this.nuevoPago.fechaPago) {
      this.mostrarError('La fecha de pago es obligatoria');
      return false;
    }

    // Validar monto pagado
    if (!this.nuevoPago.montoPagado || this.nuevoPago.montoPagado <= 0) {
      this.mostrarError('El monto pagado debe ser mayor a 0');
      return false;
    }

    // Validar método de pago
    if (!this.nuevoPago.metodoPago) {
      this.mostrarError('El método de pago es obligatorio');
      return false;
    }

    // Validar estado pago
    if (!this.nuevoPago.estadoPago) {
      this.mostrarError('El estado de pago es obligatorio');
      return false;
    }

    return true;
  }

  guardarPago(): void {
    if (!this.validarFormulario()) {
      return;
    }

    if (this.modoEdicion) {
      this.actualizarPago();
    } else {
      this.crearPago();
    }
  }

  crearPago(): void {
    // Convertir fecha a formato ISO con hora
    const fechaPagoISO = this.convertirFechaAISO(this.nuevoPago.fechaPago);

    // Preparar el DTO con solo los IDs de las relaciones
    const pagoDTO: any = {
      reserva: { idReserva: Number(this.nuevoPago.reserva.idReserva) },
      usuario: { idUsuario: Number(this.nuevoPago.usuario.idUsuario) },
      fechaPago: fechaPagoISO,
      montoPagado: Number(this.nuevoPago.montoPagado),
      metodoPago: this.nuevoPago.metodoPago,
      referencia: this.nuevoPago.referencia || '',
      estadoPago: this.nuevoPago.estadoPago,
      observaciones: this.nuevoPago.observaciones || '',
    };

    console.log('Enviando pago:', pagoDTO);

    this.pagoService.save(pagoDTO).subscribe({
      next: (response) => {
        console.log('Pago guardado:', response);
        this.mostrarExito('Pago registrado exitosamente');

        setTimeout(() => {
          this.cargarPagos();
          this.nuevoPago = this.inicializarPago();
          this.cerrarModal();
          this.limpiarMensaje();
        }, 1500);
      },
      error: (error) => {
        this.manejarError(error);
      },
    });
  }

  actualizarPago(): void {
    if (!this.nuevoPago.idPago) {
      this.mostrarError('Error: No se puede actualizar sin ID de pago');
      return;
    }

    // Convertir fecha a formato ISO con hora
    const fechaPagoISO = this.convertirFechaAISO(this.nuevoPago.fechaPago);

    // Preparar el DTO con solo los IDs de las relaciones
    const pagoDTO: any = {
      reserva: { idReserva: Number(this.nuevoPago.reserva.idReserva) },
      usuario: { idUsuario: Number(this.nuevoPago.usuario.idUsuario) },
      fechaPago: fechaPagoISO,
      montoPagado: Number(this.nuevoPago.montoPagado),
      metodoPago: this.nuevoPago.metodoPago,
      referencia: this.nuevoPago.referencia || '',
      estadoPago: this.nuevoPago.estadoPago,
      observaciones: this.nuevoPago.observaciones || '',
    };

    console.log('Actualizando pago ID:', this.nuevoPago.idPago);
    console.log('DTO a enviar:', pagoDTO);

    this.pagoService.update(this.nuevoPago.idPago, pagoDTO).subscribe({
      next: (response) => {
        console.log('Pago actualizado exitosamente');
        this.mostrarExito('Pago actualizado exitosamente');

        setTimeout(() => {
          this.cargarPagos();
          this.nuevoPago = this.inicializarPago();
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
      mensajeError = 'Pago no encontrado.';
    } else if (error.status === 500) {
      mensajeError = 'Error del servidor. Verifique los datos ingresados.';
    } else if (error.status === 0) {
      mensajeError = 'No se pudo conectar con el servidor. Verifique su conexión.';
    }

    this.mostrarError(mensajeError);
  }

  abrirModalEditar(pago: Pago): void {
    this.modoEdicion = true;
    this.nuevoPago = { ...pago };
    
    // Convertir fechaPago de ISO a formato de input date (YYYY-MM-DD)
    if (this.nuevoPago.fechaPago && this.nuevoPago.fechaPago.includes('T')) {
      this.nuevoPago.fechaPago = this.nuevoPago.fechaPago.split('T')[0];
    }
    
    this.limpiarMensaje();

    // Abrir modal programáticamente
    const modalElement = document.getElementById('modalAgregar');
    const modal = new (window as any).bootstrap.Modal(modalElement);
    modal.show();
  }

  eliminarPago(pago: Pago): void {
    const confirmar = confirm(
      `¿Está seguro de eliminar el pago #${pago.idPago}?\n\n` +
        `Reserva: ${this.obtenerDetalleReserva(pago.reserva)}\n` +
        `Cliente: ${this.obtenerNombreCompletoCliente(pago.reserva)}\n` +
        `Monto: S/ ${pago.montoPagado}\n` +
        `Fecha: ${pago.fechaPago}\n\n` +
        `Esta acción no se puede deshacer.`
    );

    if (!confirmar) {
      return;
    }

    this.pagoService.delete(pago.idPago).subscribe({
      next: () => {
        console.log('Pago eliminado:', pago.idPago);
        alert('Pago eliminado exitosamente');
        this.cargarPagos();
      },
      error: (error) => {
        console.error('Error al eliminar pago:', error);

        let mensajeError = 'Error al eliminar el pago';

        if (error.status === 404) {
          mensajeError = 'Pago no encontrado.';
        } else if (error.status === 500) {
          mensajeError = 'Error del servidor. El pago podría estar relacionado con otros registros.';
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
    this.nuevoPago = this.inicializarPago();
    this.modoEdicion = false;
    this.limpiarMensaje();
  }

  abrirModal(): void {
    this.modoEdicion = false;
    this.nuevoPago = this.inicializarPago();
    this.limpiarMensaje();
  }
}