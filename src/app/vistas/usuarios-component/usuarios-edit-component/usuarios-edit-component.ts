import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Usuario } from '../../../model/usuario';
import { UsuarioService } from '../../../services/usuario-service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-usuario-edit-component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    RouterLink,
  ],
  templateUrl: './usuarios-edit-component.html',
  styleUrl: './usuarios-edit-component.css',
})
export class UsuarioEditComponent {
  form: FormGroup;
  id: number;
  isEdit: boolean;

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      idUsuario: new FormControl(),
      nombreUsuario: new FormControl(''),
      correo: new FormControl(''),
      password: new FormControl(''),
      fechaCreacion: new FormControl(''),
      rol: new FormControl(''),
      dni: new FormControl(''),
      telefono: new FormControl(''),
      nombre: new FormControl(''),
      apellido: new FormControl(''),
      estado: new FormControl(true),
    });

    this.route.params.subscribe((data) => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.isEdit) {
      this.usuarioService.findById(this.id).subscribe((data) => {
        this.form.patchValue(data);
      });
    }
  }

  persist() {
    const usuario: Usuario = this.form.value;

    if (this.isEdit) {
      this.usuarioService.update(this.id, usuario).subscribe(() => {
        this.usuarioService.findAll().subscribe((data) => {
          this.usuarioService.setChange(data);
          this.usuarioService.setMessageChange('USUARIO ACTUALIZADO!');
        });
      });
    } else {
      this.usuarioService
        .save(usuario)
        .pipe(switchMap(() => this.usuarioService.findAll()))
        .subscribe((data) => {
          this.usuarioService.setChange(data);
          this.usuarioService.setMessageChange('USUARIO CREADO!');
        });
    }

    this.router.navigate(['pages/usuario']);
  }
}
