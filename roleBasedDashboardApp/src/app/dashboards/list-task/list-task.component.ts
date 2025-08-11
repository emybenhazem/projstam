import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from 'src/models/Task';
import { TaskService } from 'src/Service/task.service';

@Component({
  selector: 'app-list-task',
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.css']
})
export class ListTaskComponent {

 tasks: Task[] = []; // Liste des tâches récupérées depuis l'API
  selectedTasks: Task[] = []; // Pour stocker les tâches sélectionnées
  referenceId: number | undefined;
  ReferencePiece: string = ''; // Pour stocker la référence de la pièce
  taches: any[] = []; // Liste des tâches pour affichage
  tempsTotal : any ;
  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private taskServicetache: TaskService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID de la référence et le code de la pièce depuis l'URL
    this.referenceId = Number(this.route.snapshot.paramMap.get('id'));
    this.ReferencePiece = this.route.snapshot.paramMap.get('code') || '';

    console.log('Référence ID:', this.referenceId);
    console.log('Référence Code:', this.ReferencePiece);
this.loadTaches()

  }

  loadTaches(): void {
    this.taskServicetache.getTaches().subscribe((data) => {
      this.taches = data;
    });
  }

  convertirTempsEnSecondes(time: string): number {
    if (!time) return 0;

    const parts = time.split(':');
    const heures = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;
    const secondes = parseInt(parts[2], 10) || 0;

    return heures * 3600 + minutes * 60 + secondes;
  }

  // Calcul du temps total des tâches sélectionnées
  calculerTempsTotal(): void {
    const tachesSelectionnees = this.taches.filter(task => task.selected);

    if (tachesSelectionnees.length === 0) {
      alert('Veuillez sélectionner au moins une tâche.');
      return;
    }

    this.tempsTotal = tachesSelectionnees.reduce((total, task) => {
      const time = typeof task.time === 'string'
        ? this.convertirTempsEnSecondes(task.time)
        : Number(task.time) || 0;
      return total + time;
    }, 0);

    console.log('Temps total calculé :', this.tempsTotal, 'secondes');
  }

  // Gestion de la sélection des tâches
  changeSelection(task: Task): void {
    task.selected = !task.selected;

    // Ajouter ou retirer la tâche de la liste des tâches sélectionnées
    if (task.selected) {
      this.selectedTasks.push(task);
    } else {
      const index = this.selectedTasks.findIndex(t => t.id === task.id);
      if (index !== -1) {
        this.selectedTasks.splice(index, 1);
      }
    }

    console.log('Tâches sélectionnées:', this.selectedTasks); // Vérification des tâches sélectionnées
  }

  // Méthode pour gérer les erreurs de validation
  handleValidationErrors(errors: any): string {
    if (!errors) return 'Une erreur inconnue est survenue.';
    return Object.keys(errors)
      .map(key => `${key}: ${errors[key].join(', ')}`)
      .join('\n');
  }

  // Méthode pour associer des tâches à une référence
  assignTasksToReference(): void {
    if (!this.referenceId || !/^\d+$/.test(this.referenceId.toString())) {
      alert('L\'identifiant de la référence est invalide.');
      return;
    }

    if (!this.selectedTasks.length) {
      alert('Veuillez sélectionner au moins une tâche.');
      return;
    }

    if (!this.selectedTasks.every(task => task.id > 0 && (typeof task.time === 'number' || typeof task.time === 'string'))) {
      alert('Une ou plusieurs tâches sélectionnées ne sont pas valides.');
      return;
    }

    // Transforme les tâches sélectionnées pour l'envoi
    const tasksPayload = this.selectedTasks.map(task => ({
      id: task.id,
      time: typeof task.time === 'string' ? this.convertirTempsEnSecondes(task.time) : task.time,
      description: task.description || '',
      posteId: task.posteId || null,
      ordre: task.ordre || null,
      pieceId: task.pieceId || null,
      referencePiece: this.ReferencePiece?.toString() || '',
      piece: task.piece || ''
    }));

    console.log('Payload envoyé au backend:', tasksPayload);

    // Appel au service pour sauvegarder les tâches
    this.taskService.assignTasksToReference12({
      referenceId: this.referenceId,
      tasksPayload: tasksPayload
    }).subscribe(
      response => {
        console.log('Tâches enregistrées avec succès:', response);
        alert('Les tâches ont été enregistrées avec succès !');
      },
      error => {
        console.error('Erreur lors de l\'enregistrement des tâches:', error);
        const errorMessage = error.error?.errors
          ? this.handleValidationErrors(error.error.errors)
          : 'Une erreur est survenue lors de l\'enregistrement des tâches.';
        alert(errorMessage);
      }
    );
  }


  // Méthode pour sauvegarder les tâches sélectionnées dans le localStorage
  sauvegarderSelections(): void {
    const selectedTasks = this.taches.filter(task => task.selected);
    if (selectedTasks.length === 0) {
      alert('Veuillez sélectionner au moins une tâche.');
      return;
    }
    localStorage.setItem('selectedTasks', JSON.stringify(selectedTasks));
    alert('Tâches sélectionnées sauvegardées avec succès !');
  }

  // Méthode pour naviguer et calculer les tâches



  naviguerEtCalculer(): void {
    const selectedTasks = this.taches.filter(task => task.selected);
    if (selectedTasks.length === 0) {
      alert('Veuillez sélectionner au moins une tâche.');
      return;
    }

    // Récupérer la référence de la pièce depuis l'URL
    const referencePieceFromUrl = this.route.snapshot.paramMap.get('code');
    if (!referencePieceFromUrl) {
      console.error('Aucune référence trouvée dans l\'URL');
      alert('Erreur : Aucune référence de pièce trouvée.');
      return;
    }

    this.ReferencePiece = referencePieceFromUrl;

    // Affichage dans la console
    console.log('Référence Code:', this.ReferencePiece);
    console.log('Tâches sélectionnées avant mise à jour:', this.selectedTasks);

    // Vérification avant de modifier selectedTasks
    if (!this.selectedTasks || this.selectedTasks.length === 0) {
      console.error("Les tâches sélectionnées sont vides !");
      return;
    }

    // Ajouter la référence à toutes les tâches sélectionnées
    this.selectedTasks = this.selectedTasks.map(task => ({
      ...task,
      referencePieceCode: this.ReferencePiece
    }));

    console.log('Tâches sélectionnées après mise à jour:', this.selectedTasks);

    // Sauvegarder les tâches mises à jour dans localStorage
    localStorage.setItem('selectedTasks', JSON.stringify(this.selectedTasks));

    // Naviguer vers la page des affectations de tâches
    this.router.navigate(['/dashboard/task-assignments'], {
      queryParams: { referenceId: this.ReferencePiece }
    });
  }

  saveTasksWithPriorityAndPlace(): void {
    const selectedTasks = this.taches.filter((task) => task.selected);

    if (selectedTasks.length === 0) {
      alert('Veuillez sélectionner au moins une tâche.');
      return;
    }

    const payload = selectedTasks.map((task) => ({
      id: task.id,
      priorite: task.priorite,
      place: task.place,
    }));

    this.http
      .post('http://localhost:5294/api/TachesSelectionnees/SauvegarderPrioritePlace', payload)
      .subscribe(
        (response) => {
          alert('Les tâches ont été sauvegardées avec succès.');
        },
        (error) => {
          console.error('Erreur lors de la sauvegarde', error);
          alert('Une erreur est survenue lors de la sauvegarde des tâches.');
        }
      )
    ;
  }

  saveTasksForReference(): void {
    if (!this.ReferencePiece || this.selectedTasks.length === 0) {
      alert('Veuillez sélectionner une référence et au moins une tâche.');
      return;
    }

    // Préparez les données avec ReferencePieceId et TachesIds
    const payload = {
      ReferencePiece:  this.ReferencePiece,
      TachesIds: this.selectedTasks.map((task) => task.id) // Mappez les IDs des tâches sélectionnées
    };

    // Envoi des données à l'API
    this.http.post('http://localhost:5294/api/TachesSelectionnees/AffecterTaches', payload).subscribe(
      (response) => {
        alert('Les tâches ont été sauvegardées avec succès.');
        this.selectedTasks = []; // Réinitialisez les tâches sélectionnées
      },
      (error) => {
        console.error('es tâches ont été sauvegardées avec succès', error);
        alert('les tâches ont été sauvegardées avec succès.');
      }
    );
  }
  sauvegarderEtRediriger() {
    // Logique pour sauvegarder les tâches ici
    console.log('Tâches sauvegardées avec succès !');

    // Redirection vers la page des tâches regroupées
    this.router.navigate(['/dashboard/grouped-taches']);
  }

}
