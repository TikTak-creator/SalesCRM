using SalesCRM.Api.Models;

namespace SalesCRM.Api.DTOs;

public class UserDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public string RoleName => Role.ToString();
    public string AvatarUrl { get; set; } = string.Empty;
    public decimal MonthlyQuota { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public int ActiveDealsCount { get; set; }
    public decimal TotalSalesCurrentMonth { get; set; }
    public decimal QuotaAttainmentPercent => MonthlyQuota > 0 ? Math.Round((TotalSalesCurrentMonth / MonthlyQuota) * 100, 1) : 0;
}

public class CreateUserRequest
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.SalesRep;
    public decimal MonthlyQuota { get; set; } = 50000m;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Department { get; set; } = "Direct Sales";
    public string AvatarUrl { get; set; } = string.Empty;
}

public class UpdateUserRequest
{
    public string FullName { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public decimal MonthlyQuota { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public string? NewPassword { get; set; }
}
