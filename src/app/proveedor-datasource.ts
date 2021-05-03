import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { BehaviorSubject, Observable, of, pipe } from "rxjs";
import { Proveedor } from "./proveedor"
import { map, tap, catchError, finalize } from "rxjs/operators";
import { ProveedorService} from './proveedor.service'

export class ProveedorDataSource implements DataSource<Proveedor> {

    private proveedor$ = new BehaviorSubject<Proveedor[]>([]);
    private carga$ = new BehaviorSubject<boolean>(false);

    public cargando$ = this.carga$.asObservable();

    constructor(private proveedorService: ProveedorService) {}

    connect(collectionViewer: CollectionViewer): Observable<Proveedor[]> 
    {        
        return this.proveedor$.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.proveedor$.complete();
        this.carga$.complete();
    }

    cargaProveedores(courseId: number, 
                 pageIndex = 0, pageSize = 3) 
    {
        this.carga$.next(true);
        this.proveedorService.getPagina(courseId,pageIndex, pageSize)
        .pipe(
              catchError(() => of([])),
              finalize(() => this.carga$.next(false))
            ).subscribe((proveedors) => this.proveedor$.next(proveedors) 
            );

    }    

}
