import { Task } from "./Task";

export interface ReferencePiece {
  id: number;
  code: string; // Rendre code obligatoire
  tasks?: Task[]; // Liste des tâches associées
  totalExecutionTime ?: string; // Durée totale d'exécution au format hh:mm:ss
  nom : string; // Nom de la pièce de référence
}
export interface Reference {
  code: string; // Ou les autres propriétés requises
    nom?: string; // <- ici

}
