import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- Assurez-vous que ceci est importé
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router'; // Importez RouterModule

import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TokenInterceptor } from './compo/config/token-interceptor.service';
import { LoginComponent } from './compo/login/login.component';
import { UserTableFilterExcelComponent } from './compo/user-table/user-table-filter-excel.component';
import { UserTableComponent } from './compo/user-table/user-table.component';
import { ConfirmDialogComponent } from './compo/util/confirm-dialog/confirm-dialog.component';
import { InfoDialogComponent } from './compo/util/info-dialog/info-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    UserTableComponent,
    UserTableFilterExcelComponent,
    LoginComponent,
    ConfirmDialogComponent,
    InfoDialogComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule, 
    RouterModule,
    HttpClientModule,
    BrowserAnimationsModule  ,
    MatDialogModule,
    // MatButtonModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
