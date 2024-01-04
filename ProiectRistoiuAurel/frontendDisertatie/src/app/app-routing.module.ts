import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilesComponent } from './files/files.component';
import { FileUploadComponent } from './file-upload/file-upload.component';

const routes: Routes = [
  {path: 'files', component: FilesComponent},
  {path: 'upload', component: FileUploadComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
