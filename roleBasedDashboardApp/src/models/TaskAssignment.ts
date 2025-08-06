export interface TaskAssignment {
  id?: number; // Facultatif pour les nouvelles assignations
  tacheId: number;
  pieceId: number;
  description?: string; // Si nécessaire
}
  