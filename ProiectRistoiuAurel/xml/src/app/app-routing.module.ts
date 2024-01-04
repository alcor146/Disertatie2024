import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientsComponent } from './clients/clients.component';
import { JsonComponent } from './json/json.component';
import { UploadComponent } from './upload/upload.component';


const routes: Routes = [
  {path: 'clients', component: ClientsComponent},
  {path: 'upload', component: UploadComponent},
  {path: 'rentals', component: JsonComponent},
];

// definirea rutelor folosite in header

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
