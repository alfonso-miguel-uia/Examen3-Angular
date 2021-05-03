import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import {Component, ViewChild, AfterViewInit, OnInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {BehaviorSubject, merge, Observable, of as observableOf} from 'rxjs';
import {tap, catchError, map, startWith, switchMap, reduce, count} from 'rxjs/operators';
import { Proveedor } from '../proveedor'
import { ProveedorService } from '../proveedor.service'
import { ProveedorDataSource } from '../proveedor-datasource'
import { MatCard } from '@angular/material/card';
import {MatListModule} from '@angular/material/list';


@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})


/** An example database that the data source uses to retrieve data for the table. */
export class ProveedoresComponent implements AfterViewInit, OnInit  {

  dataSource: ProveedorDataSource;

  displayedColumns: string[] = ['id', 'name'];
  exampleDatabase: ProveedorService | null;
  proveedores = new BehaviorSubject<Proveedor[]>([]);
  userData:Observable<Proveedor[]>;

  resultsLength : number = 5;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  
  selectedProveedor?: Proveedor;
  
  public proveedor = { name: "", id: 0 }
  
  constructor(private datosProveedor:ProveedorService) 
  {  
    this.datosProveedor
      .getSize()
      .subscribe(id => this.resultsLength = id);
  }

  

  ngOnInit(): void 
  {    
    this.dataSource = new ProveedorDataSource(this.datosProveedor);
    this.dataSource.cargaProveedores(1, 0, 3);

    
    this.datosProveedor
      .getSize()
      .subscribe(id => this.resultsLength = id);
      

      console.log("size:  "+this.resultsLength);
 
}

  onSelect(proveedor: Proveedor): void {
    this.selectedProveedor = proveedor;
  }

  

  agregar(name: string, id:number): void {
    name = name.trim();

    var newProveedor = <Proveedor>{};
    
    newProveedor.id=id;
    newProveedor.name=name;
    newProveedor.type="proveedor";
    newProveedor.saldo=0;
    newProveedor.estado= "nuevo";
    
    if (!name) { return; }
    
    this.datosProveedor
      .getSize()
      .subscribe(id => this.resultsLength = id);

      this.datosProveedor.agregaProveedor(newProveedor).subscribe(responseList => {
        this.proveedores = responseList[0];
        this.resultsLength = responseList[1];
    });


    //this.datosProveedor.sizeProveedor$.subscribe(id => this.resultsLength = id);
    
      this.cargaProveedoresPage();
      //this.proveedores = this.datosProveedor.getPagina(0, 1, 3);
      //this.datosProveedor.getDatos();
  }

  resetPaging(): void {
    this.paginator.pageIndex = 0;
  }
  

  onRowClicked(row) {

    if(this.selectedProveedor === undefined)  
       this.selectedProveedor = <Proveedor>{};

    this.selectedProveedor.name = row.name;
    this.selectedProveedor.id = row.id;
    console.log('Row clicked: ', row);
}

  ngAfterViewInit() { 

    this.paginator.page
            .pipe(
                tap(() => this.cargaProveedoresPage())
            )
            .subscribe();
            
    console.log("proveedores:  "+this.proveedores);
    console.log("datasource:  "+this.dataSource);
  }
  
  
  cargaProveedoresPage() {
    this.dataSource.cargaProveedores(
        1,
        this.paginator.pageIndex,
        this.paginator.pageSize);
        console.log("cargaProveedoresPage():proveedores:  "+this.proveedores);
      }

}
