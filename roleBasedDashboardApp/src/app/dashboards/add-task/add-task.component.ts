import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ReferencePiece } from 'src/models/ReferencePiece';
import { TaskService } from 'src/Service/task.service';
@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent {

 tacheForm!: FormGroup;
  references: ReferencePiece[] = [];
  pieces: any[] = [];  // Stocke les pièces disponibles

  constructor(private fb: FormBuilder,private router: Router, private http: HttpClient , private tacheService : TaskService
   ) {}

  ngOnInit(): void {
    // Initialisation du formulaire
    this.tacheForm = this.fb.group({
      description: ['', Validators.required],
      referencePieceId: [null, Validators.required],  // Initialisation avec null ou 0

      time: [0, Validators.required],
      ordre: [0, Validators.required],
    });

    // Charger les références
    this.getReferences();
  }

  getReferences(): void {
    this.http.get<ReferencePiece[]>(' http://localhost:5000/api/ReferencePieces').subscribe(

      (data) => {
        this.references = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des références', error);
      }
    );
  }

  onSubmit(): void {
    if (this.tacheForm.valid) {
      const formValue = this.tacheForm.value;
      const tacheData = {
        description: formValue.description,
        tempsExecution: `00:00:${formValue.time}`, // Assuming time is in seconds
        referencePieceId: parseInt(formValue.referencePieceId, 10),
        place: formValue.ordre,
        dependenceId: null, // Or some default value
        priorite: 1, // Or some default value
      };

      this.tacheService.createTache(tacheData).subscribe({
        next: (response) => {
          console.log('Tâche ajoutée avec succès:', response);

          // Rediriger vers la liste des tâches
          this.router.navigate(['/dashboard/tasklist']);
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout de la tâche:', error);
        },
      });
    } else {
      console.log('Formulaire invalide !', this.tacheForm);
    }
  }

}
