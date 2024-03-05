import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VeterinarioComponent } from './veterinario/veterinario.component';
import { ExtraComponent } from './extra/extra.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/extra',
    pathMatch: 'full'
  },

  {
    path: 'veterinario',
    component: VeterinarioComponent
  },
  {
    path: 'extra',
    component: ExtraComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
