import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Task } from 'src/models/Task';
import { MachineService } from 'src/Service/machine.service';
import { TaskService } from 'src/Service/task.service';

import { finalize } from 'rxjs';

export interface TaskofMachine {
  id?: number; // Optionnel car généré par la BDD
  place: string;
  description: string;
  tempsTotal: number;
  dateCreation?: string; // Optionnel (géré côté back)
  referencePiece: string,  // Champ requis
  referencePieceCode: string // Champ requis
}

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {


  tasks: Task[] = []; // Liste des tâches disponibles
  referenceId!: number; // ID de la référence actuelle
  tempsTotal: number = 0; // Temps total d'exécution des tâches sélectionnées
  referenceNumber: string | undefined; // Stocker le numéro de référence
  ReferencePiece!: string; // Code de la référence sélectionnée
  machineId: string | null = null;
  selectedMachine: any = null; // Contiendra la machine sélectionnée
  selectedTasks: Task[] = [];  // Déclarez explicitement selectedTasks comme un tableau de Task

  taskAssignments: any[] = []; // La répartition des tâches après le calcul
  machinesTemps: number[] = []; // Temps total par machine
  machinesTaches: Task[][] = []; // Répartition des tâches par machine
  machines: any[] = [];
  isSending: { [key: number]: boolean } = {};
  id!: number; // Identifiant de la machine
  totalTime!: number; // Temps total en secondes
  referenceCode: string = 'code2'; // Vous pouvez l'ajuster en fonction du besoin
  isLoading = true;
  tempsParMachine : any ;
  errorMessage: string = '';
  constructor(private route: ActivatedRoute , private taskService : TaskService ,private machineservice :MachineService ) {}

  ngOnInit(): void {
    // Récupérer le paramètre referenceId et ReferencePiece à partir de l'URL
    this.route.queryParams.subscribe(params => {
      this.referenceId = params['referenceId'] || '';  // Assurez-vous que referenceId est aussi récupéré
      this.ReferencePiece = params['ReferencePiece'] || ''; // Définit une valeur par défaut si vide

      if (!this.referenceId || !this.ReferencePiece) {
        console.error('Les paramètres "referenceId" ou "ReferencePiece" sont manquants.');
      } else {
        console.log('ID de la référence récupéré:', this.referenceId);
        console.log('Code de la référence récupéré:', this.ReferencePiece);
      }
    });

    // Récupérer les tâches sélectionnées depuis le localStorage
    const tasksFromStorage = localStorage.getItem('selectedTasks');
    if (tasksFromStorage) {
      try {
        this.selectedTasks = JSON.parse(tasksFromStorage) || [];
        this.selectedTasks = this.selectedTasks.map(task => ({
          ...task,
          time: task.time || 0, // S'assure que chaque tâche a un temps valide
          description: task.description || '', // Définit une description par défaut
        }));
        console.log('Tâches sélectionnées récupérées :', this.selectedTasks);
      } catch (error) {
        console.error('Erreur lors de l\'analyse des tâches depuis le localStorage:', error);
      }
    } else {
      console.log('Aucune tâche sélectionnée trouvée dans localStorage.');
    }

    // Calculer le temps total d'exécution des tâches sélectionnées
    this.calculerTempsTotal();
    console.log('Temps total calculé :', this.tempsTotal);
  }

  selectTask(task: any): void {
    if (!this.selectedTasks.some(t => t.id === task.id)) {
      this.selectedTasks.push(task);
      localStorage.setItem('selectedTasks', JSON.stringify(this.selectedTasks));
      console.log('Tâches sélectionnées:', this.selectedTasks);
    }
  }
  loadTasks(): void {

    this.machineservice.getSortedTasks(this.referenceCode).subscribe(
      (response) => {
        this.tasks = response;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la récupération des tâches';
        console.error(error);
        this.isLoading = false;
      }
    );
  }
  calculerTempsTotal(): void {
    this.tempsTotal = this.selectedTasks.reduce((total, task) => {
      if (!task.tempsExecution) {
        console.warn(`Tâche sans temps valide :`, task);
        return total; // Ignore la tâche si le temps est invalide
      }
      const taskTimeInSeconds = this.convertTimeToSeconds(task.tempsExecution); // Utilisez tempsExecution ici
      return total + taskTimeInSeconds;
    }, 0);

    console.log(`Temps total d'exécution : ${this.formatTime(this.tempsTotal)}`);
  }


  pad(value: number): string {
    return value.toString().padStart(2, '0');
  }


saveSelectedTasks(): void {
  if (!this.referenceId) {
    console.error('ID de référence manquant ou invalide.');
    return;
  }
  localStorage.setItem('selectedTasks', JSON.stringify(this.selectedTasks));
  console.log('Tâches sauvegardées dans localStorage:', this.selectedTasks);
}

loadSelectedTasks(): void {
  const tasksFromStorage = localStorage.getItem('selectedTasks');
  if (tasksFromStorage) {
    try {
      this.selectedTasks = JSON.parse(tasksFromStorage) || [];
      console.log('Tâches récupérées depuis localStorage:', this.selectedTasks);
    } catch (error) {
      console.error('Erreur lors de l\'analyse des tâches depuis le localStorage:', error);
    }
  } else {
    console.log('Aucune tâche sélectionnée trouvée dans localStorage.');
  }
}
convertTimeToSeconds(time: string): number {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}
saveMachinesToLocalStorage(): void {
  localStorage.setItem('machines', JSON.stringify(this.machines));
}



initialiserMachines(): void {
  if (!this.machines || this.machines.length === 0) {
    this.machines = Array.from({ length: 5 }, (_, index) => ({
      id: index + 1,
      tasks: [],
      totalTime: 0, // Temps total en secondes
    }));
    console.log('Machines après initialisation:', this.machines);
  }
}

repartirTachesSurMachines2(): void {
  this.initialiserMachines();

  const sortedTasks = [...this.selectedTasks].sort((a, b) => Number(a.priorite) - Number(b.priorite));

  sortedTasks.forEach((task, index) => {
    const machineIndex = index % this.machines.length;
    const machine = this.machines[machineIndex];

    machine.tasks.push(task);
    machine.totalTime += this.convertTimeToSeconds(task.tempsExecution); // Ajouter le temps de la tâche

    console.log(`Tâche "${task.description}" (Priorité: ${task.priorite}) ajoutée à la machine ${machine.id}.`);
  });

  this.machines.forEach(machine => {
    console.log(`Machine ${machine.id}: Tâches = ${machine.tasks.map((t: Task) => t.description).join(', ')}`);
  });

  this.machines.forEach(machine => {
    console.log(`Machine ${machine.id} :`, machine.tasks);
    console.log(
      `Temps total pour la machine ${machine.id} :`,
      this.formatTime(machine.totalTime) // Conversion en HH:MM:SS
    );
  });
}

calculerTempsParMachine(tasks: any[]): { [key: number]: string } {
  const tempsParMachine: { [key: number]: number } = {};

  tasks.forEach(task => {
    if (task.selected && task.machineId) {
      const [hours, minutes, seconds] = task.tempsExecution.split(':').map(Number);
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;

      // Ajouter le temps à la machine correspondante
      if (!tempsParMachine[task.machineId]) {
        tempsParMachine[task.machineId] = 0;
      }
      tempsParMachine[task.machineId] += totalSeconds;
    }
  });

  // Convertir les secondes en HH:mm:ss
  const tempsFormateParMachine: { [key: number]: string } = {};
  Object.keys(tempsParMachine).forEach(machineId => {
    const totalSeconds = tempsParMachine[+machineId];
    const heures = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secondes = totalSeconds % 60;

    tempsFormateParMachine[+machineId] = `${heures.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secondes.toString().padStart(2, '0')}`;
  });

  return tempsFormateParMachine;
}

formatTime1(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

convertTimeToSeconds1(timeString: string): number {
  const match = timeString.match(/(\d+):(\d+):(\d+)/);
  if (!match) {
    return 0;
  }
  const [_, hours, minutes, seconds] = match.map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

envoyerTaches(machine: any): void {
  // Vérifier que la machine est valide et a un ID
  if (!machine || !machine.id) {
    console.error('Machine invalide ou ID manquant', machine);
    alert('Machine invalide ou ID manquant. Impossible d’envoyer les tâches.');
    return;
  }

  // Vérifier que des tâches sont associées à cette machine
  if (!machine.tasks || machine.tasks.length === 0) {
    alert(`Aucune tâche à envoyer pour la machine ${machine.id}.`);
    return;
  }

  // Activer le spinner pour indiquer que l'envoi est en cours
  this.isSending[machine.id] = true;

  // Préparer les données pour l'API
  console.log(`Préparation de l'envoi des tâches pour la machine ${machine.id}`, machine.tasks);

  this.machineservice.envoyerTaches(machine.id, machine.tasks)
    .pipe(
      finalize(() => {
        // Désactiver le spinner, peu importe si l'envoi a réussi ou échoué
        this.isSending[machine.id] = false;
      })
    )
    .subscribe(
      (response) => {
        console.log(`Tâches envoyées avec succès à la machine ${machine.id}`, response);
        alert(`Les tâches pour la machine ${machine.id} ont été envoyées avec succès.`);
      },
      (error) => {
        console.error(`Erreur lors de l'envoi des tâches à la machine ${machine.id}`, error);
        alert(`Une erreur est survenue lors de l'envoi des tâches pour la machine ${machine.id}.`);
      }
    );
}
envoyerTaches2(machine: any) {
  const taches = machine.tasks.map((task: any) => ({
    place: `Place ${machine.id}`,
    description: task.description,
    tempsTotal: Math.floor(task.tempsExecution / 60),
  }));

  console.log('Données envoyées :', taches);

  // Envoyer chaque tâche séparément
  taches.forEach((tache: any[]) => {
    this.machineservice.envoyerTaches1(tache).subscribe(
      (response) => console.log('Tâche envoyée avec succès:', response),
      (error) => console.error('Erreur lors de l\'envoi de la tâche:', error)
    );
  });
}

ajouterNouvelleTache(machine: any) {
  if (!machine || !machine.tasks || machine.tasks.length === 0) {
    console.error("Aucune tâche à envoyer.");
    return;
  }

  // Créer un tableau d'objets pour les tâches
  const taches = machine.tasks.map((task: any) => ({
    place: `Place ${machine.id}`,
    description: task.description,
    tempsTotal: task.tempsExecution ? this.convertirTemps(task.tempsExecution) : "00:00:00",  // ✅ Conversion correcte
    referencePiece: task.referencePiece || "Piece-001",
    referencePieceCode: task.referencePieceCode || "Code-001"
  }));

  console.log("Tâches envoyées :", taches);

  // Passer directement le tableau de tâches à l'API
  this.machineservice.envoyerTaches1(taches).subscribe({
    next: (response) => console.log("Réponse API :", response),
    error: (error) => console.error("Erreur API :", error)
  });
}


/**
 * Convertit un temps donné en format hh:mm:ss
 */
convertirTemps(tempsExecution: any): string {
  if (typeof tempsExecution === "number") {
    // Convertir minutes en hh:mm:ss
    const heures = Math.floor(tempsExecution / 60);
    const minutes = tempsExecution % 60;
    return `${String(heures).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
  } else if (typeof tempsExecution === "string" && tempsExecution.includes(":")) {
    return tempsExecution; // Déjà au format hh:mm:ss
  }
  return "00:00:00"; // Valeur par défaut
}



// Fonction pour convertir le temps de format hh:mm:ss en secondes
convertTimeToSeconds3(time: any): number {
  const timeString = typeof time === 'string' ? time : time.toString();

  const timeParts = timeString.split(':');
  const hours = parseInt(timeParts[0], 10) || 0;
  const minutes = parseInt(timeParts[1], 10) || 0;
  const seconds = parseInt(timeParts[2], 10) || 0;

  return (hours * 3600) + (minutes * 60) + seconds;
}


selectMachine(machine: any): void {
  this.selectedMachine = machine;
}

convertSecondsToTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

repartirTachesSurMachines(referenceCode: string): void {
  // Appeler l'API pour récupérer les tâches triées par priorité
  this.machineservice.getSortedTasks(referenceCode).subscribe(
    (tasks) => {
      // Initialisation des machines si ce n'est pas déjà fait
      if (!this.machines || this.machines.length === 0) {
        this.machines = Array.from({ length: 5 }, (_, index) => ({
          id: index + 1,
          tasks: [],
          totalTime: 0, // Temps total en secondes
        }));
      }

      console.log('Tâches récupérées depuis l\'API:', tasks);

      // Répartition des tâches sur les machines en équilibrant le temps
      tasks.forEach((task: any) => {
        // Trouver la machine avec le temps total le plus faible
        const machine = this.machines.reduce((prev, curr) =>
          prev.totalTime <= curr.totalTime ? prev : curr
        );

        // Ajouter la tâche à cette machine
        machine.tasks.push(task);

        // Mettre à jour le temps total de la machine
        const taskTimeInSeconds = this.convertirTempsEnSecondes(task.tempsExecution);
        machine.totalTime += taskTimeInSeconds;

        console.log(
          `Tâche "${task.description}" (Priorité: ${task.priorite}, Temps: ${task.tempsExecution}) ajoutée à la machine ${machine.id}.`
        );
      });

      // Afficher l'état final des machines
      this.machines.forEach((machine) => {
        console.log(
          `Machine ${machine.id}: Tâches = ${machine.tasks
            .map((t: any) => t.description)
            .join(', ')}, Temps total = ${machine.totalTime} secondes.`
        );
      });
    },
    (error) => {
      console.error('Erreur lors de la récupération des tâches depuis l\'API:', error);
    }
  );
}

convertirTempsEnSecondes(temps: string): number {
  const [heures, minutes, secondes] = temps.split(':').map(Number);
  return heures * 3600 + minutes * 60 + secondes;
}


repartorTachesSurMachines(): void {

  console.log('Tâches sélectionnées :', this.selectedTasks);

  // Initialiser les machines
  this.machines = Array.from({ length: 5 }, (_, index) => ({
    id: index + 1,
    tasks: [],
    totalTime: 0 // Temps total en secondes
  }));

  // Trier les tâches par temps décroissant
  const sortedTasks = [...this.selectedTasks].sort(
    (a, b) => this.convertTimeToSeconds(b.tempsExecution) - this.convertTimeToSeconds(a.tempsExecution)
  );

  console.log('Tâches triées :', sortedTasks);

  // Répartir les tâches sur les machines
  sortedTasks.forEach(task => {
    const taskTimeInSeconds = this.convertTimeToSeconds(task.tempsExecution);

    // Trouver la machine avec le temps total le plus faible
    const minMachine = this.machines.reduce((prev, curr) =>
      prev.totalTime < curr.totalTime ? prev : curr
    );

    // Ajouter la tâche à cette machine
    minMachine.tasks.push(task);
    minMachine.totalTime += taskTimeInSeconds;
    this.machineservice.setMachines(this.machines);

    console.log(`Tâche ${task.description} (Temps: ${task.tempsExecution}) ajoutée à la machine ${minMachine.id}`);
  });

  // Affichage pour vérifier la répartition
  this.machines.forEach(machine => {
    console.log(`Machine ${machine.id} :`, machine.tasks);
    console.log(
      `Temps total pour la machine ${machine.id} :`,
      this.formatTime(machine.totalTime)
    );
  });

  console.log('Répartition finale des tâches sur les machines :', this.machines);
}


}
