import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {WelcomeComponent} from "./components/welcome/welcome.component";


const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
  },
  {
    path: 'welcome',
    component: WelcomeComponent
  },
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
