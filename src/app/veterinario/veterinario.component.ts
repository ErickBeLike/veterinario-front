import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { VeterinarioServiceService } from '../services/veterinario-service.service';

@Component({
    selector: 'app-registro-cliente',
    templateUrl: './veterinario.component.html',
    styleUrls: ['./veterinario.component.css']
})
export class VeterinarioComponent implements OnInit {

    titulo = 'Agregar veterinario';
    formVeterinario: FormGroup;
    id: any | null;
    botonGuardar: boolean = true;

    constructor(
        private fb: FormBuilder,
        private veterinarioService: VeterinarioServiceService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.formVeterinario = this.fb.group({
            nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
            apellidoP: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
            apellidoM: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
            fechaNacimiento: ['', Validators.required],
            especialidad: ['', Validators.required],
            telefono: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
        });

        this.id = this.route.snapshot.paramMap.get('id');

    }

    ngOnInit(): void {
        this.esEditar();
    }

    esEditar() {
        if (this.id !== null) {
            this.titulo = 'Editar veterinario';
            this.veterinarioService.buscarVeterinarioPorId(this.id).subscribe(response => {
                this.formVeterinario.patchValue(response);
            });
        }
    }

    agregarOEditar(): void {
        if (this.id === null) {
            this.agregar();
        } else {
            // Agregar lógica para editar si es necesario
        }
    }

    agregar(): void {
        this.veterinarioService.agregarVeterinario(this.formVeterinario.value).subscribe(
            response => {
                this.router.navigate(['/veterinario']);
            },
            error => {
                console.error(error);
            }
        );
    }

    onInput(event: any) {
        const inputValue = event.target.value;
        const newValue = inputValue.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''); 
        this.formVeterinario.get('nombre')?.setValue(newValue, { emitEvent: false });
    }

    onTelefonoInput(event: any) {
        const inputValue = event.target.value;
        const newValue = inputValue.replace(/[^0-9]/g, ''); 
        this.formVeterinario.get('telefono')?.setValue(newValue, { emitEvent: false });
    }

    // Agregar este método para limpiar el formulario
    limpiarFormulario(): void {
        this.formVeterinario.reset();
    }
}
