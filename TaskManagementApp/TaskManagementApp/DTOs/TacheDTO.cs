namespace TaskManagementApp.DTOs
{
    public class TacheDTO
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public TimeSpan? TempsExecution { get; set; }
    }
}
