using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SalesCRM.Api.Models;

public class DealActivity
{
    [Key]
    public int Id { get; set; }

    public int DealId { get; set; }

    [JsonIgnore]
    [ForeignKey("DealId")]
    public Deal? Deal { get; set; }

    public int UserId { get; set; }

    [ForeignKey("UserId")]
    public User? User { get; set; }

    public ActivityType Type { get; set; } = ActivityType.Note;

    [Required]
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
