using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalesCRM.Api.Models;

public class SaleRecord
{
    [Key]
    public int Id { get; set; }

    public int? DealId { get; set; }

    [ForeignKey("DealId")]
    public Deal? Deal { get; set; }

    public int ClientId { get; set; }

    [ForeignKey("ClientId")]
    public Client? Client { get; set; }

    public int SalesRepId { get; set; }

    [ForeignKey("SalesRepId")]
    public User? SalesRep { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }

    public DateTime ClosedDate { get; set; } = DateTime.UtcNow;

    [MaxLength(50)]
    public string PaymentMethod { get; set; } = "Wire Transfer";

    [MaxLength(50)]
    public string InvoiceNumber { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Notes { get; set; } = string.Empty;
}
