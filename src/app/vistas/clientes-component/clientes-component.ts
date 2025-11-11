import { Component, ViewChild } from '@angular/core';
import { ClienteService } from '../../services/cliente-service';
import { Cliente } from '../../model/cliente';
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
  selector: 'app-cliente',
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
     DatePipe
  ],
  templateUrl: './clientes-component.html',
  styleUrl: './clientes-component.css',
})
export class ClienteComponent {
  dataSource: MatTableDataSource<Cliente>;

  columnsDefinitions = [
    { def: 'idCliente', label: 'idCliente', hide: true },
    { def: 'nombre', label: 'Nombre', hide: false },
    { def: 'apellido', label: 'Apellido', hide: false },
    { def: 'dni', label: 'DNI', hide: false },
    { def: 'telefono', label: 'Teléfono', hide: false },
    { def: 'correo', label: 'Correo', hide: false },
    { def: 'fechaRegistro', label: 'Fecha de Registro', hide: false },
    { def: 'actions', label: 'Acciones', hide: false },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private clienteService: ClienteService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.clienteService.findAll().subscribe(data => this.createTable(data));
    this.clienteService.getChange().subscribe(data => this.createTable(data));
    this.clienteService.getMessageChange().subscribe(message =>
      this._snackBar.open(message, 'INFO', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      })
    );
  }

  createTable(data: Cliente[]) {
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
    this.clienteService.delete(id)
      .pipe(switchMap(() => this.clienteService.findAll()))
      .subscribe(data => {
        this.clienteService.setChange(data);
        this.clienteService.setMessageChange('CLIENTE ELIMINADO!');
      });
  }
}
