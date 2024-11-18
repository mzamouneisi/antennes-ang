import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Antenne } from '../data/antenne.model';
import { Aservice } from './Aservice';
import { AuthService } from '../compo/config/auth.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
	providedIn: 'root'
  })
export class AntenneService extends Aservice {

	private myList: Antenne[] = []
  
	getMyList(): Antenne[] {
	  return this.myList;
	}
	setMyList(list : Antenne[]) {
	  this.myList = list 
	}
  
	getIndexInMyList(u: Antenne): number {
	  return this.getIndexUserById(u.id)
	}
  
	private apiUrl = this.API_URL + "antenne/"
  
	constructor(private http: HttpClient, private authService : AuthService) {
	  super();
	}
  
	findAll(): Observable<Antenne[]> {   
	  return this.http.get<Antenne[]>(`${this.apiUrl}`);
	}
  
	findById(id: number): Observable<Antenne> {
	  return this.http.get<Antenne>(`${this.apiUrl}${id}`);
	}
  
	add(obj: Antenne): Observable<Antenne> {
	  console.log("addNew apiUrl, obj : ", this.apiUrl, obj)
	  return this.http.post<Antenne>(this.apiUrl, obj);
	}
  
	save(obj: Antenne): Observable<Antenne> {
	  console.log("save apiUrl, obj : ", this.apiUrl, obj)
	  return this.http.put<Antenne>(this.apiUrl, obj);
	}
  
	deleteById(obj: Antenne): Observable<void> {
	  return this.http.delete<void>(`${this.apiUrl}${obj.id}`);
	}
  
	purgeAndSave(): Observable<void> {
	  return this.http.delete<void>(this.apiUrl+"purgeAndSave" );
	}
  
	importer(list: Antenne[], modeIncremental: boolean, purgeAndSaveData:boolean ): Observable<any> {
	  console.log("---- importer modeIncremental, list", modeIncremental, list )
  
	  const requestBody = {
		list,
		modeIncremental,
		purgeAndSaveData
	  };
  
	  return this.http.post<any>(this.apiUrl+"importer", requestBody);
	}
  
	getIndexUserById(id: number | null ): number {
	  let obj : Antenne | undefined
	  let i = -1
	  for (let index = 0; index < this.myList.length; index++) {
		const u : Antenne = this.myList[index];
  
		if(u.id == id) {
		  obj = u 
		  i = index 
		  break 
		}
	  }
	  return i 
	}
  
	// test(u: Antenne) {
	//   var url = `${this.apiUrl}email/admin@mysoc.com`
	//   console.log(url)
	//   return this.http.get<Antenne>(url);
	// }
  
	/////////////////////
  }
