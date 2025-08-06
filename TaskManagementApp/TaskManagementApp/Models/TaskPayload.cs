using TaskManagementApp.Models;

namespace TaskManagementApp.Models
{
    public class TaskPayload
    {
        public int Id { get; set; }  // L'ID de la tâche
        public string Description { get; set; }  // Description de la tâche
        public int Time { get; set; }  // Temps d'exécution de la tâche en minutes
    }

}
