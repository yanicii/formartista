import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneratorComponent } from './pages/generator/generator.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/generator',
    pathMatch: 'full',
  },
  {
    path: 'generator',
    component: GeneratorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
