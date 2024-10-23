import { Injectable } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from '../compo/util/info-dialog/info-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private dialog: MatDialog) {}

  showInfo(message: string): void {
    this.dialog.open(InfoDialogComponent, {
      data: message,
      width: '300px'
    });
  }
  
}
