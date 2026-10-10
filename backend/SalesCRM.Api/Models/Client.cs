using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SalesCRM.Api.Models;

public class Client
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(120)]
    public string CompanyName { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string ContactPerson { get; set; } = string.Empty;

    [MaxLength(120)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(30)]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(80)]
    public string Industry { get; set; } = "Technology";

    [MaxLength(80)]
    public string Region { get; set; } = "North America";

    public ClientStatus Status { get; set; } = ClientStatus.Lead;

    public int? AssignedUserId { get; set; }

    [ForeignKey("AssignedUserId")]
    public User? AssignedUser { get; set; }

    [MaxLength(1000)]
    public string Notes { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    [JsonIgnore]
    public ICollection<Deal> Deals { get; set; } = new List<Deal>();
}
