namespace TaskManagementApp.Models
{
    public class AssignTasksRequest
    {
        public int ReferenceId { get; set; }  // L'ID de la référence de pièce
        public List<TaskPayload> Tasks { get; set; }  // Liste des tâches à affecter
    }

}
