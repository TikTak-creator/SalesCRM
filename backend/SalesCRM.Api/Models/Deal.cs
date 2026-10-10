using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SalesCRM.Api.Models;

public class Deal
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    public int ClientId { get; set; }

    [ForeignKey("ClientId")]
    public Client? Client { get; set; }

    public int AssignedUserId { get; set; }

    [ForeignKey("AssignedUserId")]
    public User? AssignedUser { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }

    public DealStage Stage { get; set; } = DealStage.Lead;

    public int Probability { get; set; } = 20;

    public DealPriority Priority { get; set; } = DealPriority.Medium;

    public DateTime? ExpectedCloseDate { get; set; }

    public DateTime? ClosedAt { get; set; }

    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<DealActivity> Activities { get; set; } = new List<DealActivity>();
}
