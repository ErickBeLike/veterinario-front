import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VeterinarioServiceService {

  private apiUrl = 'http://localhost:8080/api/veterinarios';

  constructor(private http: HttpClient) { }

  obtenerTodosLosVeterinarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  buscarVeterinarioPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  agregarVeterinario(veterinario: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, veterinario);
  }
}
