import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './compo/login/login.component';
import { UserTableFilterExcelComponent } from './compo/user-table/user-table-filter-excel.component';
import { UserTableComponent } from './compo/user-table/user-table.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Définir la route vers le composant de connexion
  { path: '', component: LoginComponent }, // Définir la route vers le composant de connexion
    { path: 'users', component: UserTableComponent },
    { path: 'usersFilterExcel', component: UserTableFilterExcelComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
