import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Cliente } from '../../../model/cliente';
import { ClienteService } from '../../../services/cliente-service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-cliente-edit-component',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './cliente-edit-component.html',
  styleUrl: './cliente-edit-component.css',
})
export class ClienteEditComponent {
  form: FormGroup;
  id: number;
  isEdit: boolean;

  constructor(
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      idCliente: new FormControl(),
      nombre: new FormControl(''),
      apellido: new FormControl(''),
      dni: new FormControl(''),
      telefono: new FormControl(''),
      correo: new FormControl(''),
      fechaRegistro: new FormControl(''),
    });

    this.route.params.subscribe((data) => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.isEdit) {
      this.clienteService.findById(this.id).subscribe((data) => {
        this.form = new FormGroup({
          idCliente: new FormControl(data.idCliente),
          nombre: new FormControl(data.nombre),
          apellido: new FormControl(data.apellido),
          dni: new FormControl(data.dni),
          telefono: new FormControl(data.telefono),
          correo: new FormControl(data.correo),
          fechaRegistro: new FormControl(data.fechaRegistro),
        });
      });
    }
  }

  persist() {
    const cliente: Cliente = {
      idCliente: this.form.value['idCliente'],
      nombre: this.form.value['nombre'],
      apellido: this.form.value['apellido'],
      dni: this.form.value['dni'],
      telefono: this.form.value['telefono'],
      correo: this.form.value['correo'],
<<<<<<< HEAD
      fechaRegistro: this.form.value['fechaRegistro'],
=======
      fechaRegistro: "",
>>>>>>> 8756965b63e8a407d463baa6cc9d5d6928643bb8
    };

    if (this.isEdit) {
      this.clienteService.update(this.id, cliente).subscribe(() => {
        this.clienteService.findAll().subscribe((data) => {
          this.clienteService.setChange(data);
          this.clienteService.setMessageChange('CLIENTE ACTUALIZADO!');
        });
      });
    } else {
      this.clienteService
        .save(cliente)
        .pipe(switchMap(() => this.clienteService.findAll()))
        .subscribe((data) => {
          this.clienteService.setChange(data);
          this.clienteService.setMessageChange('CLIENTE CREADO!');
        });
    }

    this.router.navigate(['pages/cliente']);
  }
}
