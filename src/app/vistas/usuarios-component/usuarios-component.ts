<<<<<<< HEAD
import { Component } from '@angular/core';

@Component({
  selector: 'app-usuarios-component',
  imports: [],
  templateUrl: './usuarios-component.html',
  styleUrl: './usuarios-component.css',
})
export class UsuariosComponent {

=======
import { Component, ViewChild } from '@angular/core';
import { UsuarioService } from '../../services/usuario-service';
import { Usuario } from '../../model/usuario';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    RouterOutlet,
    RouterLink,
    DatePipe,
  ],
  templateUrl: './usuarios-component.html',
  styleUrl: './usuarios-component.css',
})
export class UsuarioComponent {
  dataSource: MatTableDataSource<Usuario>;

  columnsDefinitions = [
    { def: 'idUsuario', label: 'ID', hide: true },
    { def: 'nombreUsuario', label: 'Usuario', hide: false },
    { def: 'correo', label: 'Correo', hide: false },
    { def: 'rol', label: 'Rol', hide: false },
    { def: 'estado', label: 'Estado', hide: false },
    { def: 'fechaCreacion', label: 'Fecha Creación', hide: false },
    { def: 'actions', label: 'Acciones', hide: false },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private usuarioService: UsuarioService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.usuarioService.findAll().subscribe(data => this.createTable(data));
    this.usuarioService.getChange().subscribe(data => this.createTable(data));
    this.usuarioService.getMessageChange().subscribe(message =>
      this._snackBar.open(message, 'INFO', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      })
    );
  }

  createTable(data: Usuario[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDisplayedColumns() {
    return this.columnsDefinitions.filter(cd => !cd.hide).map(cd => cd.def);
  }

  applyFilter(event: any) {
    this.dataSource.filter = event.target.value.trim().toLowerCase();
  }

  delete(id: number) {
    this.usuarioService.delete(id)
      .pipe(switchMap(() => this.usuarioService.findAll()))
      .subscribe(data => {
        this.usuarioService.setChange(data);
        this.usuarioService.setMessageChange('USUARIO ELIMINADO!');
      });
  }
>>>>>>> 8756965b63e8a407d463baa6cc9d5d6928643bb8
}
