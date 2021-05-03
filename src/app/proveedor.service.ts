import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { forkJoin, BehaviorSubject, Observable, of } from "rxjs";
import { Proveedor } from "./proveedor"
import { map, tap, catchError } from "rxjs/operators";
import { HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })
export class ProveedorService {

  private proveedor$ = new BehaviorSubject<Proveedor[]>([]);
  public sizeProveedor$ = new BehaviorSubject<number>(-1);

  private tam:number;
  private nodo:Proveedor;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  proveedoresUrl = `http://localhost:8080/clientes`;
  proveedoresSizeUrl = `http://localhost:8080/clientes/size`;

    constructor(private http: HttpClient) {        
    }

    /******************************* no se aplica *************************************************
    public getProveedores()
    {
         //return this.http.get<Proveedor[]>(this.proveedoresUrl).subscribe((proveedors) => this.proveedor$.next(proveedors));

         return this.http.get<Proveedor[]>(this.proveedoresUrl).subscribe((proveedores: Array<any>) => {
          this.proveedor$.next(proveedores);
              tam:proveedores ? proveedores.length : 0;
      });
         //userData = this.proveedor$.asObservable();
    }

    public getDatos():BehaviorSubject<Proveedor[]>
    {
      this.proveedor$ === undefined;
      if(this.proveedor$  === undefined)
      {
        this.http.get<Proveedor[]>(this.proveedoresUrl).subscribe((proveedors) => this.proveedor$.next(proveedors));
      }
      this.proveedor$.subscribe(p => console.log(p));
      return this.proveedor$;
    }
    
 ***************************************************************************************/


    public getPagina(
      proveedorId:number,
      pageNumber = 0, pageSize = 3) :  BehaviorSubject<Proveedor[]> 
      {

        let params = new HttpParams();
        params = params.append('pagina', pageNumber.toString());
        params = params.append('proveedorId', proveedorId.toString());
        params = params.append('tamanoPag', pageSize.toString());
        
      this.http.get<Proveedor[]>(this.proveedoresUrl, {params: params}).subscribe((proveedors) => this.proveedor$.next(proveedors));
      this.proveedor$.subscribe(p => console.log(p));
      return this.proveedor$;
  }


  public getSize() : BehaviorSubject<number>
    {
      this.http.get<number>(this.proveedoresSizeUrl).subscribe((tam) => this.sizeProveedor$.next(tam));    
       return this.sizeProveedor$;
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {      
          // TODO: send the error to remote logging infrastructure
          console.error(error); // log to console instead      
          // TODO: better job of transforming error for user consumption
          console.log(`${operation} failed: ${error.message}`);      
          // Let the app keep running by returning an empty result.
          return of(result as T);
        };
      }

      /** POST: add a new proveedor to the server */
  agregaProveedor(proveedor: Proveedor): Observable<any[]>
  {
    let response1 = this.http.post<Proveedor[]>(this.proveedoresUrl, proveedor, this.httpOptions).subscribe((proveedors) => this.proveedor$.next(proveedors));
    let response2 = this.http.get<number>(this.proveedoresSizeUrl).subscribe((tam) => this.sizeProveedor$.next(tam)); 

    return forkJoin([response1, response2]);
  }

  


  buscaProveedor(proveedor: Proveedor): Observable<Proveedor> 
  {
      this.http.post<Proveedor>(this.proveedoresUrl, proveedor, this.httpOptions).subscribe((proveedor) => this.proveedor$.getValue().push(proveedor));
      //const currentValue = this.proveedor$.value;
      //const updatedValue = [...currentValue, proveedor];
      //this.proveedor$.next(updatedValue);
      return of(proveedor);
  }

}
