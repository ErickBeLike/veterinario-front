import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VeterinarioComponent } from './veterinario/veterinario.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/veterinario',
    pathMatch: 'full'
  },

  {
    path: 'veterinario',
    component: VeterinarioComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
