using System.ComponentModel.DataAnnotations;

namespace Challenge2.DB.Models
{
    public class Entry
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(32)]
        [RegularExpression("^[a-zA-Z0-9]*$", ErrorMessage = "Only letters and digits allowed")]
        public string Link { get; set; }

        [Required]
        [MaxLength(256)]
        [Url]
        public string Url { get; set; }
    }
}
