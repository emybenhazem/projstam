using TaskManagementApp.Models;

namespace TaskManagementApp.Services
{
    public class OrdonnancementService
    {
        public List<Models.Task> SynchroniserTaches(List<Models.Task> tachesSelectionnees)
        {
            // Algorithme d'ordonnancement
            var tempsMachines = new int[5]; // Temps total pour chaque machine
            foreach (var tache in tachesSelectionnees)
            {
                // Trouver la machine avec le temps le plus faible
                var indexMachine = Array.IndexOf(tempsMachines, tempsMachines.Min());
                tache.MachineId = indexMachine + 1; // Attribuer la machine (1 à 5)
                tempsMachines[indexMachine] += (int)tache.TempsExecution.TotalSeconds; // Ajouter le temps
            }
            return tachesSelectionnees;
        }
    }
}
