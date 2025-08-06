import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReferencePiece } from 'src/models/ReferencePiece';
export interface Machine {
  id: string;
  name: string;
  status: string;
  // Ajoutez les propriétés supplémentaires selon votre API
}


export interface Task {
  id: number;
  name: string;
  tempsExecution: string; // Format hh:mm:ss
}
@Injectable({
  providedIn: 'root'
})
export class MachineService {

  constructor(private http: HttpClient) { }
 private baseUrl1 = 'http://localhost:5294/api/TaskofMachine'
  private apiUrl = 'http://localhost:5294/api/machines';
  private Url = 'http://localhost:5294/api/TachesSelectionnees/sorted'; // Remplacez par l'URL de votre API
  private baseUrl = 'http://localhost:5294/api/machines'; // Base URL de l'API
  private apiUrl2 = 'http://localhost:5294/api/TaskofMachine/getTasks';
    private apiUrl1 = 'http://localhost:5001/api/ReferencePiece/addReference';
  private apiUrl22= 'https://localhost:5001/api/ReferencePiece/references'
    private apiUrl4 = 'http://localhost:5001/api/ReferencePiece/addReference'
 private apiUrl7 = 'http://localhost:5000/api/ReferencePieces';
  machines = [
    { id: 1, tasks: [], totalTime: 0 },
    { id: 2, tasks: [], totalTime: 0 },
    { id: 3, tasks: [], totalTime: 0 },
    { id: 4, tasks: [], totalTime: 0 },
    { id: 5, tasks: [], totalTime: 0 },
  ];

  setMachines(machines: any[]): void {
    this.machines = machines;
  }
envoyerTaches1(taches: any[] ,) {
  return this.http.post(this.baseUrl1, taches);
}
getTasksForMachine(machineId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/${machineId}`);
}

getSortedTasks(referenceCode: string): Observable<any> {
  const params = new HttpParams().set('referenceCode', referenceCode);

  return this.http.get(`${this.Url}/code2`, { params });
}

envoyerTaches(machineId: number, tasks: any[]): Observable<any> {
  // Filtrer les tâches pour inclure uniquement les propriétés nécessaires
  const filteredTasks = tasks.map((task) => ({
    description: task.description,
    tempsExecution: task.tempsExecution,
    referencePieceId: task.referencePieceId,
    place: task.place,
    priorite: task.priorite,
  }));

  // Préparer le payload
  const payload = { tasks: filteredTasks };
  const url = `http://localhost:5294/api/machines/${machineId}/tasks`;

  console.log('Payload envoyé :', JSON.stringify(payload, null, 2));

  return this.http.post(url, payload);
}
 // Méthode pour ajouter une valeur scannée
  addScannedCode(code: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Construire l'objet de référence attendu par le backend
    const body = {
      id: 1,             // Vous pouvez ajuster cet ID si besoin
      code: code,        // Le code scanné du QR
      tasks: null        // Initialise tasks à null comme dans votre exemple
    };

    return this.http.post<any>(this.apiUrl1, body, { headers });
  }

  getScannedCodes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl22}`);
  }
  addReference(reference: ReferencePiece): Observable<ReferencePiece> {
  return this.http.post<ReferencePiece>(`${this.apiUrl4}`, reference);
}


  addReferencePieces(pieces: ReferencePiece[]) {
    return this.http.post(this.apiUrl7, pieces);
  }
}
