
interface AssignTasksDto
{

    PieceId: number;
    TaskIds: number[]; // Liste des IDs des tâches
    TacheId: number;
    ReferencePiece: string;
    DateAssigned: string; // Date en format ISO
    TotalExecutionTime :string

}
