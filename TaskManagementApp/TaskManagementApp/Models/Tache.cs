using System.Text.Json.Serialization;

namespace TaskManagementApp.Models
{

    public class Tache
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public TimeSpan TempsExecution { get; set; } // Utiliser TimeSpan


        public int ReferencePieceId { get; set; }
        public int Place { get; set; }

        public int? DependenceId { get; set; } // ID de la tâche dont dépend cette tâche
        public int Priorite { get; set; } // Niveau de priorité (1 = haute priorité)

        [JsonIgnore]

        public ReferencePiece? ReferencePiece { get; set; } // Navigation Property
        public List<TachesSelectionnees> TachesSelectionnees { get; set; } = new List<TachesSelectionnees>();

    }

}
