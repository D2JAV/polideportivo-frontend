 
import { Actividad } from "./actividad";
import { Campo } from "./campo";
import { Cliente } from "./cliente";
import { Usuario } from "./usuario";

export interface Reserva {
  idReserva: number;
  cliente: Cliente;
  campo: Campo;
  actividad: Actividad;
  fechaReserva: string;
  horaInicio: string;
  duracionHoras: number;
  montoTotal: number;
  usuario: Usuario;
  estado: string;
  fechaCreacion: string;
}