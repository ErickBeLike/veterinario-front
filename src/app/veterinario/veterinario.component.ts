import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { VeterinarioServiceService } from '../services/veterinario-service.service';
import { jsPDF } from 'jspdf';

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
            telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/)]],
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
        // Mostrar ventana emergente de confirmación
        const confirmacion = window.confirm('¿Está seguro de que desea guardar el registro del veterinario?');

        if (confirmacion) {
            this.veterinarioService.agregarVeterinario(this.formVeterinario.value).subscribe(
                response => {
                    this.generarPDF(response);
                    this.generarJSON(response);
                    this.router.navigate(['/veterinario']);
                },
                error => {
                    console.error(error);
                }
            );
        }
    }

    generarPDF(veterinario: any): void {
        const pdf = new jsPDF();
    
        // Configurar estilo del PDF
        pdf.setFillColor(255, 255, 255); // Fondo blanco
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(14);
        pdf.setTextColor(33, 33, 33); // Texto más oscuro
    
        // Definir posición y tamaño del cuadro
        const boxX = 20;
        const boxY = 20;
        const boxWidth = 170;
        const boxHeight = 120;
    
        // Dibujar el cuadro con borde redondeado
        pdf.setLineWidth(1);
        pdf.setDrawColor(180, 180, 180);
        pdf.roundedRect(boxX, boxY, boxWidth, boxHeight, 5, 5, 'S'); // Borde redondeado
    
        // Agregar un logo al PDF en la esquina superior derecha
        const logoImg = new Image();
        logoImg.src = 'assets/img/rauwlogo.png';
        const logoWidth = 20;
        const logoHeight = 20;
        pdf.addImage(logoImg, 'PNG', boxX + boxWidth - logoWidth - 15, boxY + 5, logoWidth, logoHeight);

    
        // Agregar contenido al PDF con formato atractivo
        pdf.text('Información del Veterinario', 40, boxY + 15);
    
        const startY = boxY + 30;
        const lineHeight = 10;
    
        // Formatear la fecha de nacimiento
        const fechaNacimiento = new Date(veterinario.fechaNacimiento).toLocaleDateString('es-ES');
    
        pdf.setFontSize(12);
        pdf.setTextColor(227, 108, 34); // Cambiar color del texto siguiente
    
        pdf.text(`Nombre(s): ${veterinario.nombre}`, boxX + 30, startY);
        pdf.text(`Apellido Paterno: ${veterinario.apellidoP}`, boxX + 30, startY + lineHeight);
        pdf.text(`Apellido Materno: ${veterinario.apellidoM}`, boxX + 30, startY + 2 * lineHeight);
        pdf.text(`Fecha de Nacimiento: ${fechaNacimiento}`, boxX + 30, startY + 3 * lineHeight);
        pdf.text(`Especialidad: ${veterinario.especialidad}`, boxX + 30, startY + 4 * lineHeight);
        pdf.text(`Teléfono: ${veterinario.telefono}`, boxX + 30, startY + 5 * lineHeight);
    
        // Agregar un pie de página dentro del margen
        pdf.setFontSize(10);
        pdf.setTextColor(150, 150, 150); // Color de texto más claro
        const footerX = boxX;
        const footerY = boxY + boxHeight + 15;
        pdf.text('Registro controlado de VeterinariaRauw', footerX, footerY);
    
        // Guardar el PDF con el nombre del veterinario
        pdf.save(`Veterinario_${veterinario.id}.pdf`);
    }
    
    generarJSON(veterinario: any): void {
        const jsonContent = JSON.stringify(veterinario, null, 2);
        const blob = new Blob([jsonContent], { type: 'text/plain' });
        const link = document.createElement('a');
    
        link.href = window.URL.createObjectURL(blob);
        link.download = `VeterinarioJSON_${veterinario.id}.txt`;
        
        link.click();
    }    

    // Función para aplicar lógica de input
    applyInputLogic(fieldName: string, event: any) {
        const inputValue = event.target.value;
        const newValue = inputValue.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
        this.formVeterinario.get(fieldName)?.setValue(newValue, { emitEvent: false });
    }

    // Evento para 'nombre'
    onNombreInput(event: any) {
        this.applyInputLogic('nombre', event);
        this.updateButtonState();
    }

    // Evento para 'apellidoP'
    onApellidoPInput(event: any) {
        this.applyInputLogic('apellidoP', event);
        this.updateButtonState();
    }

    // Evento para 'apellidoM'
    onApellidoMInput(event: any) {
        this.applyInputLogic('apellidoM', event);
        this.updateButtonState();
    }

    applyTelefonoFormat(event: any) {
        const inputValue = event.target.value;
        const newValue = inputValue.replace(/[^0-9]/g, '');
    
        // Limitar a 10 caracteres
        const limitedValue = newValue.slice(0, 10);
    
        // Aplicar formato de número de teléfono (000-000-0000)
        let formattedValue = '';
        for (let i = 0; i < limitedValue.length; i++) {
            if (i === 3 || i === 6) {
                formattedValue += '-';
            }
            formattedValue += limitedValue.charAt(i);
        }
    
        this.formVeterinario.get('telefono')?.setValue(formattedValue, { emitEvent: false });
        this.updateButtonState();
    }
    
    onTelefonoInput(event: any) {
        this.applyTelefonoFormat(event);
    }

    updateButtonState(): void {
        // Verificar si el formulario es válido
        this.botonGuardar = !this.formVeterinario.invalid;
    }

    // Agregar este método para limpiar el formulario
    limpiarFormulario(): void {
        this.formVeterinario.reset();
        this.botonGuardar = true;
    }
}
