using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TaskManagementApp.Models
{
    public class TachesSelectionnees
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ReferencePieceId { get; set; } // Clé étrangère basée sur ReferencePiece.Id

        [Required]
        public int TacheId { get; set; }

        public DateTime DateSelection { get; set; } = DateTime.Now;

        // Relations
        [ForeignKey("ReferencePieceId")]
        public ReferencePiece ReferencePiece { get; set; }

        [ForeignKey("TacheId")]
        public Tache Tache { get; set; }

    }
}
