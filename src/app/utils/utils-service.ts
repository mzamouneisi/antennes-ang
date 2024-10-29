import { Injectable } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from '../compo/util/info-dialog/info-dialog.component';
import { Aservice } from '../service/Aservice';

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


  /**
   * Convertit une chaîne de format 'yyyy/MM/dd' en Date
   * @param dateString - La date en chaîne 'yyyy/MM/dd'
   * @returns La date en tant qu'objet Date ou null si le format est incorrect
   */
  stringToDate(dateString: string): Date | null {
    const [year, month, day] = dateString.split('/').map(Number);
    if (year && month && day) {
      return new Date(year, month - 1, day); // month - 1 car les mois commencent à 0 en JavaScript
    }
    return null;
  }

  /**
   * Convertit un objet Date en chaîne au format 'yyyy/MM/dd'
   * @param date - La date à convertir
   * @returns La chaîne 'yyyy/MM/dd' ou une chaîne vide si la date est invalide
   */
  dateToString(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return ''; // Date invalide
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ajout du 0 pour les mois < 10
    const day = date.getDate().toString().padStart(2, '0'); // Ajout du 0 pour les jours < 10
    return `${year}/${month}/${day}`;
  }

  formatDate(dateString: string): string {
    if(!dateString) return '';
    
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

}
