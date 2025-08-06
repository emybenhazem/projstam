export class Task {
  id!: number;
  reference?: string;
  fileData?: any;
  referencePieceCode?: string;
  posteId!: number;
  referenceId?: number; // Suppose que `referenceId` est une chaîne
  referencePieceId!: number;  // ✅ Vérifie le nom
  DependenceId?: any;
  ReferencePiece :any
  Place :any
  ordre!: number;
  selected?: boolean;
  piece!: string; // Or some other type
  priorite !: number; // Notez 'priorite' ici
  time!: any; // Accepte les deux formats
  fileName?: string;
  fixation?: number;
  Description?: string;
  TempsExecution! :string
  description?: string;
  dureeEnSecondes?: number;
  imageUrl?: string;
  machineId?: number;


}

export interface Task {
  fileName?: string;
  fixation?: number;
  description?: string;
  tempsExecution: string;
  referencePieceId: number;  // ✅ Vérifie le nom

}
export interface Task {
  description?: string;
  ordre: number;
  pieceId: number;
  priorite: number; // Priorité attribuée à la tâche$74
  place: number; // Numéro de poste ou place
  referencePieceId: number;  // ✅ Vérifie le nom

}
