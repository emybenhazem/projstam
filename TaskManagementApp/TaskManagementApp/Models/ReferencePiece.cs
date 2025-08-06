using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace TaskManagementApp.Models
{
    public class ReferencePiece
    {
        public int Id { get; set; } // Clé primaire (int)
        public string Code { get; set; } // Index sera configuré via Fluent API
        public TimeSpan TotalExecutionTime { get; set; } // Temps d'exécution
        public string Nom { get; set; }

        public List<Tache> Taches { get; set; }
    }
}
