import { Component } from '@angular/core';
import { saveAs } from 'file-saver';
import { UtilService } from 'src/app/utils/utils-service';
import { MyUser } from '../../data/my-user.model';
import { MyUserService } from '../../service/my-user.service';
import { AuthService } from '../config/auth.service';

@Component({
  selector: 'user-table-filter-excel',
  templateUrl: './user-table-filter-excel.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableFilterExcelComponent {
  users: MyUser[] = [];

  // Filtres des valeurs uniques
  nameFilterValues: string[] = [];
  emailFilterValues: string[] = [];
  passwordFilterValues: string[] = [];
  ageFilterValues: number[] = [];
  dateNaissFilterValues: string[] = [];
  profileFilterValues: string[] = [];

  // Sélections des filtres
  selectedNameFilter: string = '';
  selectedEmailFilter: string = '';
  selectedPasswordFilter: string = '';
  selectedAgeFilter: number | '' = '';
  selectedDateNaissFilter: string = '';
  selectedProfileFilter: string = '';

  constructor(private userService: MyUserService, public authService: AuthService, public util : UtilService) { }

  currentUser: MyUser = {id : null, name: '', email: '', password: '', age: 0, dateNaiss: '', profile: 'USER', isCryptPass : false };
  editingIndex: number | null = null;

  showActions(): boolean {
    const user: MyUser | null = this.authService.getUserConnected(); // Préciser que `user` peut être null
    if (user && user.profile === "ADMIN") {
      return true;
    }
    return false;
  }

      // Fonction pour éditer un utilisateur
      editUser(index: number) {
        this.editingIndex = index;
        this.currentUser = { ...this.users[index] };  // Cloner les données de l'utilisateur sélectionné
      }
  
      deleteUser(index: number) {
        this.users.splice(index, 1); // Supprime l'utilisateur de la liste
      }
  
      isEmailUnique(email: string): boolean {
        return !this.users.some(user => user.email === email);
      }
  
   // Fonction pour sauvegarder un utilisateur (ajout ou modification)
   saveUser() {
  
    if (this.editingIndex === null && !this.isEmailUnique(this.currentUser.email)) {
      alert('Cet email est déjà utilisé !');
      return;
    }
    
    if (this.editingIndex !== null) {
      // Mettre à jour l'utilisateur existant
      this.users[this.editingIndex] = { ...this.currentUser };
      this.editingIndex = null;
    } else {
      // Ajouter un nouvel utilisateur
      this.users.push({ ...this.currentUser });
    }
  
    // Réinitialiser le formulaire
    this.currentUser = {id: null, name: '', email: '', password:'', age: 0, dateNaiss: '', profile: 'USER', isCryptPass : false };
  }
  

  ngOnInit() {
    this.users = this.userService.getUsers();
    this.populateFilterValues();
  }

  // Remplir les valeurs de filtres uniques
  populateFilterValues() {
    this.nameFilterValues = Array.from(new Set(this.users.map(user => user.name)));
    this.emailFilterValues = Array.from(new Set(this.users.map(user => user.email)));
    this.passwordFilterValues = Array.from(new Set(this.users.map(user => user.password)));
    this.ageFilterValues = Array.from(new Set(this.users.map(user => user.age)));
    this.dateNaissFilterValues = Array.from(new Set(this.users.map(user => user.dateNaiss)));
    this.profileFilterValues = Array.from(new Set(this.users.map(user => user.profile)));
  }

  get filteredUsers(): MyUser[] {
    return this.users.filter(user => {
      return (
        (!this.selectedNameFilter || user.name === this.selectedNameFilter) &&
        (!this.selectedEmailFilter || user.email === this.selectedEmailFilter) &&
        (!this.selectedPasswordFilter || user.password === this.selectedPasswordFilter) &&
        (!this.selectedAgeFilter || user.age === this.selectedAgeFilter) &&
        (!this.selectedDateNaissFilter || user.dateNaiss === this.selectedDateNaissFilter) &&
        (!this.selectedProfileFilter || user.profile === this.selectedProfileFilter)
      );
    });
  }

  exportAsCSV() {
    const csvData = this.convertToCSV(this.filteredUsers);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'users.csv');
  }

  convertToCSV(data: MyUser[]): string {
    const header = 'Name,Email,Password,Âge,Date de naissance,Profile\n';
    const rows = data.map(user => `${user.name},${user.email},${user.password},${user.age},${user.dateNaiss},${user.profile}`).join('\n');
    return header + rows;
  }

  exportAsExcel() {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.filteredUsers);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(blob, 'users.xlsx');
    });
  }

  onFileChange(event: any) {
    // Import file logic remains unchanged
  }

  readCSV(file: File) {
    // CSV parsing logic remains unchanged
  }

  readExcel(file: File) {
    // Excel parsing logic remains unchanged
  }
}
