using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using TaskManagementApp.Data;
using TaskManagementApp.DTOs;
using TaskManagementApp.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

[Route("api/[controller]")]
[ApiController]
public class TachesSelectionneesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TachesSelectionneesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // POST: api/TachesSelectionnees/PostTachesSelectionnees
    [HttpPost("PostTachesSelectionnees")]
    public async Task<IActionResult> PostTachesSelectionnees([FromBody] List<TacheSelectionneeDto> selectedTasks)
    {
        if (selectedTasks == null || !selectedTasks.Any())
        {
            return BadRequest("Aucune tâche sélectionnée n'a été envoyée.");
        }

        foreach (var selectedTask in selectedTasks)
        {
            var referencePiece = await _context.ReferencePieces.FindAsync(selectedTask.ReferencePieceId);
            if (referencePiece == null)
            {
                return BadRequest($"La référence avec l'ID {selectedTask.ReferencePieceId} n'existe pas.");
            }

            var tache = await _context.Taches.FindAsync(selectedTask.TacheId);
            if (tache == null)
            {
                return BadRequest($"La tâche avec l'ID {selectedTask.TacheId} n'existe pas.");
            }

            var tacheSelectionnee = new TachesSelectionnees
            {
                ReferencePieceId = selectedTask.ReferencePieceId,
                TacheId = selectedTask.TacheId,
                DateSelection = DateTime.Now
            };

            _context.TachesSelectionnees.Add(tacheSelectionnee);
        }

        await _context.SaveChangesAsync();
        return Ok("Les tâches sélectionnées ont été sauvegardées avec succès.");
    }

    // POST: api/TachesSelectionnees/Sauvegarder
    [HttpPost("Sauvegarder")]
    public async Task<IActionResult> SauvegarderTachesSelectionnees([FromBody] List<TacheSelectionneeDto> tachesSelectionneesDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        foreach (var selectedTask in tachesSelectionneesDto)
        {
            // Recherche de la référence pièce par Code, pas par Id
            var referencePiece = await _context.ReferencePieces
    .FirstOrDefaultAsync(rp => rp.Id == selectedTask.ReferencePieceId); // Utilisation de Id ici



            if (referencePiece == null)
            {
                return BadRequest($"La référence avec le Code {selectedTask.ReferencePieceId} n'existe pas.");
            }

            var tache = await _context.Taches.FindAsync(selectedTask.TacheId);
            if (tache == null)
            {
                return BadRequest($"La tâche avec l'ID {selectedTask.TacheId} n'existe pas.");
            }

            var tacheSelectionnee = new TachesSelectionnees
            {
                ReferencePieceId = selectedTask.ReferencePieceId,  // Valeur correcte à insérer
                TacheId = selectedTask.TacheId,
                DateSelection = DateTime.Now
            };

            _context.TachesSelectionnees.Add(tacheSelectionnee);
        }

        await _context.SaveChangesAsync();
        return Ok("Les tâches sélectionnées ont été sauvegardées avec succès.");
    }


    [HttpPost("AffecterTaches")]
    public async Task<IActionResult> AffecterTaches([FromBody] AffecterTachesDto dto)
    {
        // Vérifiez si la référence existe
        var referencePiece = await _context.ReferencePieces
            .FirstOrDefaultAsync(rp => rp.Id == dto.ReferencePieceId);

        if (referencePiece == null)
        {
            return NotFound($"La référence avec l'Id {dto.ReferencePieceId} n'existe pas.");
        }

        // Vérifiez si les tâches existent
        var taches = await _context.Taches
            .Where(t => dto.TachesIds.Contains(t.Id))
            .ToListAsync();

        if (taches.Count != dto.TachesIds.Count)
        {
            return BadRequest("Certaines tâches n'existent pas.");
        }

        // Ajoutez les relations dans la table TachesSelectionnees
        foreach (var tacheId in dto.TachesIds)
        {
            var tacheSelectionnee = new TachesSelectionnees
            {
                ReferencePieceId = dto.ReferencePieceId,
                TacheId = tacheId,
                DateSelection = DateTime.Now
            };

            _context.TachesSelectionnees.Add(tacheSelectionnee);
        }

        await _context.SaveChangesAsync();
        return Ok("Tâches affectées avec succès à la référence.");
    }

    [HttpGet("{referencePieceId}/Taches")]
    public async Task<IActionResult> GetTachesForReferencePiece(int referencePieceId)
    {
        var taches = await _context.TachesSelectionnees
            .Where(ts => ts.ReferencePieceId == referencePieceId)
            .Include(ts => ts.Tache) // Inclure les détails des tâches
            .Select(ts => new
            {
                ts.Tache.Id,
                ts.Tache.Description,
                ts.Tache.TempsExecution
            })
            .ToListAsync();

        if (!taches.Any())
        {
            return NotFound($"Aucune tâche trouvée pour la référence avec l'Id {referencePieceId}.");
        }

        return Ok(taches);
    }

    [HttpGet("api/TachesSelectionnees/{referencePieceId}/Taches")]
    
    public async Task<IActionResult> GetTachesForReference2(int referencePieceId)
    {
        // Retrieve the reference piece from the database, including related tasks
        var referencePiece = await _context.ReferencePieces
            .Include(rp => rp.Taches)
            .FirstOrDefaultAsync(rp => rp.Id == referencePieceId);

        // If the reference piece doesn't exist, return a 404 Not Found response
        if (referencePiece == null)
        {
            return NotFound($"La référence avec l'ID {referencePieceId} n'a pas été trouvée.");
        }
        var totalTempsExecution = referencePiece.Taches
    .Select(t => t.TempsExecution) // TempsExecution is already a TimeSpan
    .Sum(ts => ts.TotalMinutes); // Sum the total minutes of all tasks

        // Calculate the total execution time by summing the execution time of all tasks

        // Prepare the list of tasks to return, including their description and execution time
        var result = referencePiece.Taches.Select(t => new
        {
            t.Id,
            t.Description,
            TempsExecution = t.TempsExecution
        }).ToList();

        // Return the tasks and the total execution time in the response
        return Ok(new
        {
            Taches = result,
            TotalTempsExecution = totalTempsExecution
        });
    }

    [HttpGet("api/TachesSelectionnees/Taches")]
    public async Task<IActionResult> GetAllTaches()
    {
        var allTaches = await _context.ReferencePieces
            .Include(rp => rp.Taches)
            .ToListAsync();

        var result = allTaches.SelectMany(rp => rp.Taches).Select(t => new
        {
            t.Id,
            t.Description,
            t.TempsExecution
        }).ToList();



        var totalTempsExecution = allTaches.SelectMany(rp => rp.Taches)
            .Select(t => t.TempsExecution) // TempsExecution is already a TimeSpan
    .Sum(ts => ts.TotalMinutes); // Sum the total minutes of all tasks

        return Ok(new
        {
            Taches = result,
            TotalTempsExecution = totalTempsExecution
        });
    }


    [HttpGet("grouped-taches")]
    public async Task<IActionResult> GetGroupedTaches()
    {
        try
        {
            var result = await _context.TachesSelectionnees
                .GroupBy(t => t.ReferencePieceId)
                .Select(g => new
                {
                    ReferencePieceId = g.Key,
                    TotalTaches = g.Count(),
                })
                .ToListAsync();

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Une erreur s'est produite lors de l'exécution de la requête : {ex.Message}");
        }
    }


    [HttpGet("api/TachesSelectionnees/{referencePieceId}/TachesTime")]
    public async Task<IActionResult> GetTachesForReferencetime(int referencePieceId)

    {
        var referencePiece = await _context.ReferencePieces
            .Include(rp => rp.Taches) // Inclure les tâches associées à la référence
            .FirstOrDefaultAsync(rp => rp.Id == referencePieceId);

        if (referencePiece == null)
        {
            return NotFound($"La référence avec l'ID {referencePieceId} n'a pas été trouvée.");
        }

        // Calculer le temps d'exécution total en minutes
        var totalTempsExecution = referencePiece.Taches
            .Select(t => t.TempsExecution) // Extraire le temps d'exécution des tâches
            .Sum(ts => ts.TotalMinutes); // Somme des minutes d'exécution

        // Préparer les données à retourner, y compris les détails des tâches
        var result = referencePiece.Taches.Select(t => new
        {
            t.Id,
            t.Description,
            TempsExecution = t.TempsExecution
        }).ToList();

        // Retourner les tâches avec le temps d'exécution total
        return Ok(new
        {
            Taches = result,
            TotalTempsExecution = totalTempsExecution // Temps total d'exécution
        });
    }

    [HttpGet("GetTotalExecutionTimes")]
    public async Task<IActionResult> GetTotalExecutionTimes()
    {
        var result = await (from ts in _context.TachesSelectionnees
                            join t in _context.Taches on ts.TacheId equals t.Id
                            join rp in _context.ReferencePieces on ts.ReferencePieceId equals rp.Id
                            group new { ts, t, rp } by new { ts.ReferencePieceId, rp.Code } into grouped
                            select new
                            {
                                ReferencePieceId = grouped.Key.ReferencePieceId,
                                ReferenceCode = grouped.Key.Code,
                                TotalExecutionTime = TimeSpan.FromSeconds(grouped
                                    .Sum(g => EF.Functions.DateDiffSecond(TimeSpan.Zero, g.t.TempsExecution)))
                                    .ToString(@"hh\:mm\:ss") // Formatage en HH:mm:ss
                            }).ToListAsync();

        return Ok(result);
    }


    [HttpGet("{code}")]
    public IActionResult GetReferenceByCode(string code)
    {
        var reference = _context.ReferencePieces
            .Include(r => r.Taches) // Inclure les tâches associées
            .FirstOrDefault(r => r.Code == code);

        if (reference == null)
        {
            return NotFound(new { message = "Référence introuvable." });
        }

        return Ok(reference);
    }

    // Route pour récupérer les tâches sans tri
    [HttpGet("unsorted/{code}")]
    public async Task<IActionResult> GetTasksByReferenceCode(string referenceCode)
    {
        var tasks = await _context.TachesSelectionnees
            .Include(ts => ts.ReferencePiece)
            .Include(ts => ts.Tache)
            .Where(ts => ts.ReferencePiece.Code == referenceCode)
            .Select(ts => new
            {
                ts.Tache.Id,
                ts.Tache.Description,
                ts.Tache.TempsExecution,
                ts.Tache.Priorite,
                ts.DateSelection
            })
            .ToListAsync();

        return Ok(tasks);
    }

    // Route pour récupérer les tâches triées par priorité
    [HttpGet("sorted/{code}")]
    public async Task<IActionResult> GetSortedTasksByReferenceCode(string referenceCode)
    {
        var tasks = await _context.TachesSelectionnees
            .Include(ts => ts.ReferencePiece)
            .Include(ts => ts.Tache)
            .Where(ts => ts.ReferencePiece.Code == referenceCode)
            .Select(ts => new
            {
                ts.Tache.Id,
                ts.Tache.Description,
                ts.Tache.TempsExecution,
                ts.Tache.Priorite,
                ts.DateSelection
            })
            .ToListAsync();

        // Tri des tâches par priorité
        var sortedTasks = tasks.OrderBy(t => t.Priorite).ToList();

        return Ok(sortedTasks);
    }


}



public class TacheSelectionneeDto
{
    public int ReferencePieceId { get; set; } // Changer en string si c'est une chaîne
    public int TacheId { get; set; }
}