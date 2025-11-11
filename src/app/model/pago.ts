import { Reserva } from "./reserva";
import { Usuario } from "./usuario";

export interface Pago  {
  idPago: number;
  reserva: Reserva;
  fechaPago: string;
  montoPagado: number;
  metodoPago: string;
  referencia: string;
  estadoPago: string;
  usuario: Usuario;
  observaciones: string;
}