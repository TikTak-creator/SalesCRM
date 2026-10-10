using SalesCRM.Api.Models;

namespace SalesCRM.Api.DTOs;

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public UserDto User { get; set; } = null!;
}

public class CurrentUserDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public decimal MonthlyQuota { get; set; }
    public string Department { get; set; } = string.Empty;
}
