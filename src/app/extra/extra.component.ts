import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-extra',
  templateUrl: './extra.component.html',
  styleUrl: './extra.component.css'
})
export class ExtraComponent {

  constructor(private router: Router) {}

  registrarVeterinario(): void {
    // Redirige a la ruta '/veterinario'
    this.router.navigate(['/veterinario']);
}

}
