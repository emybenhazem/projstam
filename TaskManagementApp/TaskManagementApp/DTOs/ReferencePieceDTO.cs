namespace TaskManagementApp.DTOs
{
    namespace TaskManagementApp.DTOs
    {
        public class ReferencePieceDTO
        {
            public int Id { get; set; }
            public string Code { get; set; }
            public string Nom { get; set; }
            public List<TacheDTO> Taches { get; set; }
        }
    }

}
