import { Injectable } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from '../compo/util/info-dialog/info-dialog.component';
import { Aservice } from './Aservice';

@Injectable({
  providedIn: 'root'
})
export class UtilService extends Aservice {

  constructor(private dialog: MatDialog) {
    super();
  }

  showInfo(message: string): void {
    this.dialog.open(InfoDialogComponent, {
      data: message,
      width: '300px'
    });
  }
  
}
