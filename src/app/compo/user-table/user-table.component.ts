import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver'; // Utilisez file-saver pour télécharger les fichiers
import * as XLSX from 'xlsx';
import { MyUser } from '../../data/my-user.model';
import { MyUserService } from '../../service/my-user.service';
import { AuthService } from '../config/auth.service';

import { MatDialog } from '@angular/material/dialog';
import { UtilService } from 'src/app/utils/utils-service';
import { ConfirmDialogComponent } from '../util/confirm-dialog/confirm-dialog.component';

const tableHeaders = ['name', 'email', 'password', 'age', 'dateNaiss', 'profile'];

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent implements OnInit {
  users: MyUser[] = [];
  modeIncremental: boolean = true;
  userConnected = this.authService.userConnected

  constructor(private myService: MyUserService, public authService: AuthService, private dialog: MatDialog, public util: UtilService) {
    this.userConnected = this.authService.getUserConnected()
  }

  ngOnInit(): void {
    //   this.users = this.userService.getUsers(); 
    this.findAll()
  }

  findAll() {
    console.log("ihm findAll")
    this.myService.findAll().subscribe(data => {
      console.log("findAll : data : ", data)
      this.users = data;
      this.myService.setUsers(this.users)
    },
      error => {
        console.error('Error findAll', error)
      }
    );
  }

  currentUser: MyUser = this.getMyUserInit();
  editingIndex: number | null = null;  // Index de l'utilisateur en cours d'édition
  isShowForm = false

  // Filtres
  nameFilter: string = '';
  emailFilter: string = '';
  passwordFilter: string = '';
  ageFilter: string = '';
  dateNaissFilter: string = '';
  profileFilter: string = '';

  showPanelExport = false
  showPanelImport = false

  // Méthode pour filtrer les utilisateurs
  get filteredUsers(): MyUser[] {
    return this.users.filter(user => {
      return (
        (!this.nameFilter || user.name.toLowerCase().includes(this.nameFilter.toLowerCase())) &&
        (!this.emailFilter || user.email.toLowerCase().includes(this.emailFilter.toLowerCase())) &&
        (!this.passwordFilter || user.password.toLowerCase().includes(this.passwordFilter.toLowerCase())) &&
        (!this.ageFilter || user.age.toString().includes(this.ageFilter)) &&
        (!this.dateNaissFilter || user.dateNaiss.includes(this.dateNaissFilter)) &&
        (!this.profileFilter || user.profile.includes(this.profileFilter))
      );
    });
  }

  isColIdUnique(email: string): boolean {
    return !this.users.some(user => user.email === email);
  }

  isColIdUniqueOfCurrentUser(): boolean {
    return this.isColIdUnique(this.currentUser.email);
  }

  private findById(newUser: MyUser): MyUser | undefined {
    return this.users.find(user => user.email === newUser.email);
  }

  getMyUserInit(): MyUser {
    return { id: null, name: '', email: '', password: '', age: 0, dateNaiss: '', profile: 'USER', isCryptPass: false };
  }

  ///////////////////////////////////////////////////

  showActions(): boolean {
    const user: MyUser | null = this.authService.getUserConnected();
    if (user && user.profile === "ADMIN") {
      return true;
    }
    return false;
  }

  showFormEdit() {
    return this.isShowForm || (this.users && this.users.length == 0)
  }

  closeFormEdit() {
    this.isShowForm = false
  }

  // Fonction pour éditer un utilisateur
  editUser(index: number) {
    this.isShowForm = true
    this.editingIndex = index;
    this.currentUser = { ...this.filteredUsers[index] };  // Cloner les données de l'utilisateur sélectionné
    if (this.currentUser.dateNaiss) {
      this.currentUser.dateNaiss = new Date(this.currentUser.dateNaiss).toISOString().split('T')[0];
    }
  }

  initUser() {
    this.isShowForm = true
    this.currentUser = this.getMyUserInit();
    this.editingIndex = null;
  }

  deleteUser(index: number) {
    // console.log("deleteUser : userConnected : ", this.userConnected)
    const email = this.userConnected?.email
    const currentUser = this.filteredUsers[index]
    // console.log("deleteUser : email : ", email)
    // console.log("index, currentUser.email : ", index, currentUser.email)

    if (!currentUser.email) {
      this.util.showInfo("currentUser.email is null !")
      return
    }

    if (currentUser.email == email) {
      this.util.showInfo("On ne peut pas supprimer le user connected !")
      return
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.myService.deleteById(currentUser).subscribe(
          () => this.findAll(),
          error => console.error('Error deleting user', error)
        );
      }
    });

  }

  // Fonction pour sauvegarder un utilisateur (ajout ou modification)
  saveUser() {

    if (this.editingIndex === null && !this.isColIdUniqueOfCurrentUser()) {
      alert('Cet email est déjà utilisé !');
      return;
    }

    if (this.editingIndex !== null) {
      // Mettre à jour l'utilisateur existant
      if(this.currentUser.dateNaiss  ) {
        this.currentUser.dateNaiss = new Date(this.currentUser.dateNaiss).toISOString()
      }
      console.log("this.currentUser", this.currentUser)
      this.filteredUsers[this.editingIndex] = { ...this.currentUser };
      let i = this.editingIndex
      this.myService.save(this.currentUser).subscribe(data => {
        console.log("resp i, data : ", i, data)
        this.currentUser = data
        i = this.myService.getIndexInUsers(this.currentUser)
        this.users[i] = { ...data };
      },
        error => {
          console.error('Error on save', error)
        }
      );
      this.editingIndex = null;
    } else {
      // Ajouter un nouvel utilisateur
      if (this.currentUser.name && this.currentUser.email) {
        this.users.push({ ...this.currentUser });
        this.myService.add(this.currentUser).subscribe(data => {
          console.log(data)
        },
          error => {
            console.error('Error on add new ', error)
          }
        );
      }
    }

    this.myService.setUsers(this.users)

    // Réinitialiser le formulaire
    this.currentUser = this.getMyUserInit();
  }

  test() {
    this.myService.test(this.currentUser).subscribe(data => {
      console.log("test : data ", data)
    },
      error => {
        console.error('Error test', error)
      }
    );
  }

  ////////////////////////////////////////////////

  getCSVHeader() {
    return tableHeaders.join(',') + '\n';
  };

  getCSVLine(user: MyUser) {
    let line = '';

    // Parcourir les headers pour récupérer les propriétés correspondantes de l'utilisateur
    tableHeaders.forEach((header, index) => {
      // Si ce n'est pas le premier élément, ajouter une virgule pour séparer les valeurs
      if (index > 0) {
        line += ',';
      }

      // Ajouter la valeur correspondante de l'utilisateur
      line += user[header as keyof MyUser];  // Utilisation de 'as keyof' pour la sécurité de type
    });

    return line;
  };

  exportType: string = 'csv'; // Valeur par défaut

  export() {
    if (this.exportType === 'csv') {
      this.exportAsCSV();
    } else if (this.exportType === 'xlsx') {
      this.exportAsExcel();
    }
    this.showPanelExport = false
  }


  // Exporter les données filtrées en CSV
  exportAsCSV() {
    const csvData = this.convertToCSV(this.filteredUsers);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'users.csv');
  }

  convertToCSV(data: MyUser[]): string {
    const header = this.getCSVHeader();
    const rows = data.map(user => this.getCSVLine(user)).join('\n');
    return header + rows;
  }

  // Exporter les données filtrées en Excel (XLSX)
  exportAsExcel() {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.filteredUsers);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(blob, 'users.xlsx');
    });
  }

  // Lorsque le fichier change (l'utilisateur sélectionne un fichier)
  onFileChange(event: any) {

    this.myService.purgeAndSave().subscribe(data1 => {
      console.log("purgeAndSave : data : ", data1)

      console.log("onFileChange : modeIncremental : ", this.modeIncremental)

      if(!this.modeIncremental) {
        this.users = []
      }

      console.log("onFileChange : users : ", this.users)

      const file = event.target.files[0];

      if (file) {
        const fileExtension = file.name.split('.').pop().toLowerCase();

        let isErr = false 

        if (fileExtension === 'csv') {
          this.readCSV(file);
        } else if (fileExtension === 'xlsx') {
          this.readExcel(file);
        } else {
          isErr = true 
          alert('Veuillez sélectionner un fichier CSV ou Excel');
        }

        if(!isErr) this.importerInServer(); 

      }

    },
      error1 => {
        console.error('Error purgeAndSave', error1)
      }
    );


  }

  // Importer un fichier CSV
  readCSV(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const csv = e.target.result;
      const lines = csv.split('\n');
      const result: MyUser[] = [];

      // Ne pas importer la première ligne : extraire les names de colonnes
      const headerLine = lines[0];
      const headers = headerLine.split(',').map((header: string) => header.trim().toLowerCase());

      // Vérifier que les names de colonnes du fichier correspondent à ceux attendus
      const expectedHeaders = tableHeaders;

      console.log("headers=", headers)
      console.log("expectedHeaders=", expectedHeaders)

      // Vérifier la correspondance des colonnes
      const validFile = expectedHeaders.every(expectedHeader =>
        headers.some((header: string) => header.toLowerCase() === expectedHeader.toLowerCase())
      );

      if (!validFile) {
        alert('Le fichier CSV ne contient pas les colonnes attendues. Importation annulée.');
        return;
      }

      const indexes: { [key: string]: number } = {};

      headers.forEach((header: string) => {
        indexes[header] = headers.indexOf(header)
      });

      // Parcourir chaque ligne du CSV (sauter la première ligne d'en-tête)
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const columns = line.split(',');

        // S'assurer que la ligne contient le bon nombre de colonnes
        if (columns.length < expectedHeaders.length) continue;

        const newUser: MyUser = {} as MyUser; // Initialize an empty MyUser object

        headers.forEach((header: keyof MyUser) => {
          if (header === 'age') {
            newUser[header] = Number(columns[indexes[header]]?.trim()) || 0;
          } else if (header === 'id') {
            newUser[header] = Number(columns[indexes[header]]?.trim()) || null;
          } else if (header === 'isCryptPass') {
            newUser[header] = Boolean(columns[indexes[header]]?.trim()) || false;
          } else {
            newUser[header] = columns[indexes[header]]?.trim() || '';
          }
        });

        // Appeler la méthode correcte selon le type d'import
        if (this.modeIncremental) {
          this.saveIncremental(newUser);
        } else {
          this.saveFull(newUser);
        }
      }
    };
    reader.readAsText(file);

  }

  // Importer un fichier Excel (XLSX)
  readExcel(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Sélectionner la première feuille de calcul
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Convertir la feuille en JSON, avec la première ligne en en-têtes (header: 1)
      const excelData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Vérifier si les colonnes correspondent à celles attendues
      const expectedHeaders = tableHeaders;

      // La première ligne du fichier Excel contient les names de colonnes
      const headers = excelData[0].map((header: string) => header.trim().toLowerCase());

      // Vérifier la correspondance des colonnes
      const validFile = expectedHeaders.every(expectedHeader =>
        headers.some((header: string) => header.toLowerCase() === expectedHeader.toLowerCase())
      );

      if (!validFile) {
        alert('Le fichier Excel ne contient pas les colonnes attendues. Importation annulée.');
        return;
      }

      const indexes: { [key: string]: number } = {};

      headers.forEach((header: string) => {
        indexes[header] = headers.indexOf(header)
      });

      // Parcourir chaque ligne des données Excel (en commençant après les en-têtes)
      for (let i = 1; i < excelData.length; i++) {
        const row = excelData[i];

        // Assurer que la ligne contient suffisamment de colonnes
        if (row.length < expectedHeaders.length) continue;

        const newUser: MyUser = {} as MyUser; // Initialize an empty MyUser object

        headers.forEach((header: string) => {

          if (header in newUser) {
            const key = header as keyof MyUser
            const value = row[indexes[key]]?.trim();

            if (key === 'age') {
              newUser[key] = Number(value) || 0;
            } else if (key === 'id') {
              newUser[key] = Number(value) || null;
            }
            else if (key === 'isCryptPass') {
              newUser[key] = Boolean(value?.trim()) || false;
            } else if (typeof newUser[key] === 'string') {
              newUser[key] = value || '';
            }
          }

        });


        // Appeler la méthode correcte selon le type d'import
        if (this.modeIncremental) {
          this.saveIncremental(newUser);
        } else {
          this.saveFull(newUser);
        }
      }
    };
    reader.readAsArrayBuffer(file);
  }

  // Sauvegarde incrémentale : Mise à jour ou ajout de l'utilisateur
  saveIncremental(newUser: MyUser) {
    const existingUser = this.findById(newUser);

    if (existingUser) {

      tableHeaders.forEach((header: string) => {
        const key = header as keyof MyUser
        // Ici, nous devons faire une conversion explicite des types pour dire à TypeScript que
        // nous savons que les valeurs sont compatibles.
        (existingUser[key] as any) = newUser[key];
      });
    } else {
      // Ajouter un nouvel utilisateur si l'email n'existe pas
      this.users.push(newUser);
    }
  }

  // Sauvegarde complète : Ajouter tous les utilisateurs (remplacement complet)
  saveFull(newUser: MyUser) {
    this.users.push(newUser); // Ajoute l'utilisateur à la table (remplacement complet)
  }

  importerInServer() {
    
    console.log("importerInServer : modeIncremental, users : ", this.modeIncremental, this.users )

    this.myService.importer(this.users, this.modeIncremental, false ).subscribe(data => {
      console.log("importerInServer : data : ", data)
    },
      error => {
        console.error('Error importer', error)
      }
    );
  }


}
