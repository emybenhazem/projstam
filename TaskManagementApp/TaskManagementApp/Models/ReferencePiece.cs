using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace TaskManagementApp.Models
{
    public class ReferencePiece
    {
        public int Id { get; set; } // Clé primaire (int)
        public string Code { get; set; } // Index sera configuré via Fluent API
        public TimeSpan TotalExecutionTime { get; set; } // Temps d'exécution
        public string Nom { get; set; }

        [JsonPropertyName("tasks")]
        public List<Tache> Taches { get; set; }
    }
}
