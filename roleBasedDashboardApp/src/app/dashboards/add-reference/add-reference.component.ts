import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from 'src/models/Task';
import { TaskService } from 'src/Service/task.service';

@Component({
  selector: 'app-add-reference',
  templateUrl: './add-reference.component.html',
  styleUrls: ['./add-reference.component.css']
})

export class AddReferenceComponent {
   scannedCode: string = ''; // Code scanné par l'utilisateur
  references: any[] = []; // Liste des références scannées
  errorMessage: string = ''; // Pour afficher les erreurs
  referenceId!: number;  // ID de la référence sélectionnée
  tasks: Task[] = [];    // Liste des tâches associées à la référence

  constructor(
    private qrCodeDataService: TaskService,
    private router: Router,
    private route: ActivatedRoute,
    private taskService : TaskService
  ) {}

  ngOnInit(): void {
    // Vérifier si l'ID est présent dans l'URL
    this.referenceId = +this.route.snapshot.paramMap.get('id')!;
    // Charger les références dès que le composant est initialisé
    this.loadReferences();

    this.loadReferences2();
  }
loadReferences2(): void {
    this.taskService.getReferencePieces().subscribe((data) => {
      this.references = data;
    });
  }
  loadReferences(): void {
    this.taskService.getScannedCodes().subscribe(
      (data) => {
        this.references = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des références:', error);
        this.errorMessage = 'Échec du chargement des références.';
      }
    );
  }

  // Lorsqu'une référence est sélectionnée, naviguer vers la page des tâches

  onSelectReference(referenceId: number) {
    const reference = this.references.find(ref => ref.id === referenceId);
    if (reference) {
      console.log('Navigation vers :', ['/dashboard/tasklist', referenceId, reference.code]);
      this.router.navigate(['/dashboard/tasklist', referenceId, reference.code]);
    } else {
      console.error('Référence introuvable :', referenceId);
    }
  }

  // Répartition des tâches sur plusieurs places (machines)
  distributeTasks(reference: any, tasks: Task[], numPlaces: number = 5) {
    // Initialiser les places avec 0
    let places = Array(numPlaces).fill(0);

    // Trier les tâches par durée (temps d'exécution)
    tasks.sort((a, b) => b.time - a.time);

    // Répartir les tâches
    tasks.forEach(task => {
      // Trouver la place avec le temps d'exécution minimum
      let minPlaceIndex = places.indexOf(Math.min(...places));
      places[minPlaceIndex] += task.time;
    });

    // Affecter les tâches à la référence
    reference.tasks = tasks;

    console.log("Temps d'exécution par place:", places);
  }

}
