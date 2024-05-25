import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ShareFileComponent } from 'src/app/dialogs/share-file/share-file.component';
import { ShareDialogData } from 'src/app/models/files/share-dialog-data';

@Injectable({
  providedIn: 'root'
})
export class DialogServiceShareFileService {

  constructor(private dialog: MatDialog) { }

  shareDialog(data: ShareDialogData): Observable<boolean>{
    const popUp = this.dialog
    .open(ShareFileComponent, {
      data,
      width: '450px',
      disableClose: true,
    });

    return popUp.afterClosed();
  }
}
