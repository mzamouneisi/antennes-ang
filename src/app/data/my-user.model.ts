export interface MyUser {
    id : number | null  ;
    name: string;
    email: string; // Email unique
    password: string; // Mot de passe ajouté
    age: number;
    dateNaiss: string;
    profile: string;  // ADMIN ou USER
    isCryptPass : boolean ;
}
