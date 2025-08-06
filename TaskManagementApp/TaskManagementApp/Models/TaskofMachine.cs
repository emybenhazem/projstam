using System;
using System.ComponentModel.DataAnnotations;

public class TaskofMachine
{
    public int Id { get; set; }
    public int MachineId { get; set; }
    public string Description { get; set; }
    public TimeSpan TempsTotal { get; set; }
    public DateTime DateCreation { get; set; }

    // Ajout du champ temporaire
    public bool TempColumn { get; set; }
    public string ReferencePiece { get; set; }
    public string ReferencePieceCode { get; set; }
}
