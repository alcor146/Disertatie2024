import { Component, Inject, OnInit, Optional} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ShareDialogData } from 'src/app/models/files/share-dialog-data'

@Component({
  selector: 'app-share-file',
  templateUrl: './share-file.component.html',
  styleUrls: ['./share-file.component.css']
})
export class ShareFileComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ShareFileComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ShareDialogData) {}

    onclose(){
      this.data.confirmText = "close";
    }

  ngOnInit(): void {
  }
}
