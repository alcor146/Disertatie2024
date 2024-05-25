import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FilesComponent } from './files/files.component';

import { HttpClientModule } from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';

import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSortModule} from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import {FileUploadComponent } from './file-upload/file-upload.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {NgxPaginationModule } from 'ngx-pagination';

import { MetamaskService } from './services/metamask.service';

import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ShareFileComponent } from './dialogs/share-file/share-file.component';

import {MatMenuModule} from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FilesComponent,
    FileUploadComponent,
    ShareFileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,  
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule,
    MatPaginatorModule,
    NgxPaginationModule,
    MatSelectModule,
    MatDialogModule,
    MatMenuModule

  ],
  exports: [
    MatTableModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule
  ],
  providers: [MetamaskService],
  bootstrap: [AppComponent]
})
export class AppModule { }
