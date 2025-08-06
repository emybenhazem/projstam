using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TaskManagementApp.Data;
using TaskManagementApp.Models;

[ApiController]
[Route("api/machines")]
public class MachinesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MachinesController(ApplicationDbContext context)
    {
        _context = context;
    }

    private static Dictionary<int, List<TaskDto>> _machineTasks = new();

    [HttpPost("{machineId}/tasks")]

    public IActionResult ReceiveTasks(int machineId, [FromBody] TaskRequest request)
    {
        Console.WriteLine($"Requête reçue : MachineId={machineId}");

        if (request == null || request.Tasks == null || !request.Tasks.Any())
        {
            Console.WriteLine("Aucune tâche reçue.");
            return BadRequest("Aucune tâche fournie.");
        }

        Console.WriteLine($"Nombre de tâches reçues : {request.Tasks.Count}");

        // Sauvegarder les tâches dans un stockage en mémoire pour cette machine
        if (!_machineTasks.ContainsKey(machineId))
        {
            _machineTasks[machineId] = new List<TaskDto>();
        }
        _machineTasks[machineId].AddRange(request.Tasks);

        // Affichage détaillé des tâches
        foreach (var task in request.Tasks)
        {
            Console.WriteLine($"Tâche : {task.Description}, Temps : {task.TempsExecution}, Référence : {task.ReferencePieceId}");
        }

        return Ok(new { Message = $"Tâches reçues pour la machine {machineId}." });
    }

    [HttpPost]
    [Route("api/machines/{machineId}/tasks2")]
    public async Task<IActionResult> AddTasks(int machineId, [FromBody] List<TaskDto> tasks)
    {
        if (tasks == null || !tasks.Any())
        {
            return BadRequest("La liste des tâches est requise.");
        }

        foreach (var taskDto in tasks)
        {
            // Créez l'entité Tache à partir du DTO
            var taskEntity = new Tache
            {
                Description = taskDto.Description,
                TempsExecution = (taskDto.TempsExecution), // Si TempsExecution est string, le convertir en TimeSpan
                Priorite = taskDto.Priorite,
                // Assurez-vous que d'autres champs nécessaires sont renseignés ici si nécessaire
            };

            // Ajout de la tâche au contexte
            _context.Taches.Add(taskEntity);
            Console.WriteLine($"Tâche ajoutée : {taskDto.Description}, Temps : {taskDto.TempsExecution}, Priorité : {taskDto.Priorite}");
        }

        // Sauvegarde dans la base de données
        await _context.SaveChangesAsync();

        return Ok(new { Message = "Tâches enregistrées." });
    }



    [Route("{machineId}/tasks")] 

    [HttpGet]

    public IActionResult GetTasks1(int machineId, string? referenceCode = null )
    {
        if (!_machineTasks.ContainsKey(machineId) || !_machineTasks[machineId].Any())
        {
            return NotFound(new { Message = $"Aucune tâche trouvée pour la machine {machineId}." });
        }

        return Ok(_machineTasks[machineId]);
    }
    [ApiController]
    [Route("api/machines/{machineId}/tasks")]
    public class TasksController : ControllerBase
    {
        [HttpGet("{referenceCode?}")]
        public IActionResult GetTasks(int machineId, string? referenceCode)
        {
            // Votre logique ici
        
        // Vérifier si la machine existe et contient des références de tâches
        if (!_machineTasks.ContainsKey(machineId) || !_machineTasks[machineId].Any())
        {
            return NotFound(new { Message = $"Aucune tâche trouvée pour la machine {machineId}." });
        }

        // Récupérer les tâches de la machine
        var tasks = _machineTasks[machineId];

        // Filtrer les tâches par le code de référence
        if (!string.IsNullOrEmpty(referenceCode))
        {
            // Filtrer les tâches en fonction de la référence (sur base de ReferencePiece)
            tasks = tasks.Where(task => task.ReferencePieceCode != null && task.ReferencePiece.Code == referenceCode).ToList();

        }

        // Si aucune tâche ne correspond au filtre, retourner une réponse NotFound
        if (!tasks.Any())
        {
            return NotFound(new { Message = $"Aucune tâche trouvée pour la référence '{referenceCode}' sur la machine {machineId}." });
        }

        // Retourner les tâches filtrées ou toutes les tâches
        return Ok(tasks);
    }

   
}

    [HttpPost("sauvegarder")]
    public IActionResult SauvegarderTaches([FromBody] List<Tache> taches)
    {
        if (taches == null || !taches.Any())
            return BadRequest("Liste de tâches vide.");

        // Trier les tâches par TempsExecution
        taches = taches.OrderBy(t => t.TempsExecution).ToList();

        _context.Taches.AddRange(taches);
        _context.SaveChanges();

        return Ok("Tâches sauvegardées avec succès.");
    }

    // Récupérer les tâches par machine
 

    // Assure-toi d'avoir cette propriété

    public class TaskRequest
    {
        public List<TaskDto> Tasks { get; set; }
    }
    public class TaskDto
    {
        public string Description { get; set; }
        public TimeSpan TempsExecution { get; set; }
        public int Place { get; set; }
        public int DependenceId { get; set; }
        public int Priorite { get; set; }
        public int ReferencePieceId { get; set; }
        public string ReferencePieceCode { get; set; }
        public ReferencePiece ReferencePiece { get; set; } 
    }


    public class ReferencePieceDto
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public TimeSpan TotalExecutionTime { get; set; }
        public string Nom { get; set; }
        public List<TaskDto> Taches { get; set; }
    }
    public class TacheSelectionnee
    {
        public int Id { get; set; }
        public int MachineId { get; set; }
        public string Description { get; set; }
        public TimeSpan TempsExecution { get; set; }
        public int Place { get; set; }
        public int DependenceId { get; set; }
        public int Priorite { get; set; }
        public int ReferencePieceId { get; set; }
        public string ReferencePieceCode { get; set; }
        public DateTime DateSelection { get; set; }
    }

}
