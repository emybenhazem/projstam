namespace TaskManagementApp.Models
{
    public class Task
    {
        public int Id { get; set; } // Clé primaire
        public string Description { get; set; }
        public TimeSpan TempsExecution { get; set; }
        public int MachineId { get; set; } // 1 à 5
}
}
