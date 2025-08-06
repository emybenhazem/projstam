import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { ReferencePiece } from 'src/models/ReferencePiece';
import { Task } from 'src/models/Task'; // Assurez-vous que le chemin est correct
interface TacheSelection {
  referencePieceId: number;
  totalTaches: number;
  premiereSelection: string;
  derniereSelection: string;
}
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  Url='http://localhost:5294/api/ReferencePieces/calculate-and-display-total-execution-time'
    private apiUrl4 = 'http://localhost:5001/api/ReferencePiece/addReference'
  private apiUrl2= 'https://localhost:5001/api/ReferencePiece/references'

  private apiUrl = 'http://localhost:5000/api/ReferencePieces';
  private baseUrl = 'http://localhost:5000/api/Taches';
  private url ='http://localhost:5000/api/TachesSelectionnees/grouped-taches';
  private apiUrl1 = 'http://backend-server/api/machines'; // URL du backend
  private baseUrl2 = '/api/machines';

  constructor(private http: HttpClient) {}


  getTasksByReference(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  getTaches(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }
addReference(reference: ReferencePiece): Observable<ReferencePiece> {
  return this.http.post<ReferencePiece>(`${this.apiUrl4}`, reference);
}

  // Méthode pour récupérer les références
  getReferencePieces(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  assignTasksToReference12(payload: { referenceId: number, tasksPayload: any[] }) {
    return this.http.post<any>('/api/tasks/assign', payload)
      .pipe(
        catchError((error) => {
          console.error('Erreur lors de l\'assignation des tâches', error);
          return throwError(() => error);
        })
      );
  }
  getScannedCodes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl2}`);
  }


  getGroupedTaches(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0',
    });

    return this.http.get<any[]>(`${this.url}/grouped-taches`, { headers });
  }



getTacheSelections(): Observable<TacheSelection[]> {
  return this.http.get<TacheSelection[]>(`${this.url}`).pipe(
    tap((data) => {
      console.log('Données récupérées depuis l’API :', data); // Log ici
    })
  );
}
getTime(): Observable<any[]> {
  return this.http.get<any[]>('http://localhost:5294/api/TachesSelectionnees/GetTotalExecutionTimes').pipe(
    tap((data) => {
      console.log('Données récupérées depuis l’API :', data); // Log ici
    })
  );
}
getTotalExecutionTimes(): Observable<any[]> {
  return this.http.get<any[]>(this.apiUrl);
}
gettotaltimexecution():
Observable<any[]> {
  return this.http.get<any[]>(this.Url);
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


recupererTaches(machineId: number): Observable<any> {
  return this.http.get(`${this.apiUrl1}/${1}/tasks`).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Erreur lors de la récupération des tâches:', error.message, error);
      return throwError(() => error);
    })
  );
}
getTasks(machineId: number): Observable<any> {
  return this.http.get(`http://localhost:5294/api/machines/${machineId}/tasks`).pipe(
    catchError((error) => {
      console.error('Erreur capturée dans le service :', error);
      return of([]); // Retourner une liste vide en cas d'erreur
    })
  );
}

getAllTaches(): Observable<Task[]> {
  return this.http.get<Task[]>('http://localhost:5294/api/taches');
}
getTaches2(): Observable<Task[]> {
  return this.http.get<Task[]>(`${this.apiUrl}/taches`); // Remplacez par l'URL correcte
}

getTasksByMachineAndReference(machineId: number, referenceCode?: string): Observable<any> {
  const url = referenceCode
    ? `${this.apiUrl}/machines/${machineId}/tasks/${referenceCode}`
    : `${this.apiUrl}/machines/${machineId}/tasks`;

  return this.http.get(url);
}
createTache(tache: any) {
  return this.http.post('http://localhost:5000/api/Taches/AddTache2', tache);
}



}


