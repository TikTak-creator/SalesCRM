using SalesCRM.Api.Models;

namespace SalesCRM.Api.DTOs;

public class ClientDto
{
    public int Id { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string ContactPerson { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Industry { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
    public ClientStatus Status { get; set; }
    public string StatusName => Status.ToString();
    public int? AssignedUserId { get; set; }
    public string? AssignedUserName { get; set; }
    public string Notes { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public int DealsCount { get; set; }
    public decimal TotalDealValue { get; set; }
}

public class CreateClientRequest
{
    public string CompanyName { get; set; } = string.Empty;
    public string ContactPerson { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Industry { get; set; } = "Technology";
    public string Region { get; set; } = "North America";
    public ClientStatus Status { get; set; } = ClientStatus.Lead;
    public int? AssignedUserId { get; set; }
    public string Notes { get; set; } = string.Empty;
}

public class UpdateClientRequest
{
    public string CompanyName { get; set; } = string.Empty;
    public string ContactPerson { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Industry { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
    public ClientStatus Status { get; set; }
    public int? AssignedUserId { get; set; }
    public string Notes { get; set; } = string.Empty;
}
