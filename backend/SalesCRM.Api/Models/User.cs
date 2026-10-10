using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SalesCRM.Api.Models;

public class User
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(120)]
    public string Email { get; set; } = string.Empty;

    [JsonIgnore]
    [Required]
    [MaxLength(255)]
    public string PasswordHash { get; set; } = string.Empty;

    public UserRole Role { get; set; } = UserRole.SalesRep;

    [MaxLength(255)]
    public string AvatarUrl { get; set; } = string.Empty;

    [Column(TypeName = "decimal(18,2)")]
    public decimal MonthlyQuota { get; set; } = 50000m;

    [MaxLength(30)]
    public string PhoneNumber { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Department { get; set; } = "Direct Sales";

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    [JsonIgnore]
    public ICollection<Deal> Deals { get; set; } = new List<Deal>();

    [JsonIgnore]
    public ICollection<Client> Clients { get; set; } = new List<Client>();

    [JsonIgnore]
    public ICollection<SaleRecord> Sales { get; set; } = new List<SaleRecord>();
}
