import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActorsComponent } from './actors.component';
import { ActorsListComponent } from './actors-list/actors-list.component';

const routes: Routes = [{
  path: '',
  component: ActorsComponent,
  children: [
    {
      path: 'lista',
      component: ActorsListComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActorsRoutingModule { }
