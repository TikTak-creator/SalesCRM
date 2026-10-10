using System.Security.Claims;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalesCRM.Api.Data;
using SalesCRM.Api.DTOs;
using SalesCRM.Api.Models;
using SalesCRM.Api.Services;

namespace SalesCRM.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly CrmDbContext _context;
    private readonly IJwtService _jwtService;

    public AuthController(CrmDbContext context, IJwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Email and password are required." });
        }

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower().Trim());
        if (user == null || !user.IsActive)
        {
            return Unauthorized(new { message = "Invalid email or account is deactivated." });
        }

        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        if (!isPasswordValid)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        var token = _jwtService.GenerateToken(user);

        var userDto = new UserDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role,
            AvatarUrl = user.AvatarUrl,
            MonthlyQuota = user.MonthlyQuota,
            PhoneNumber = user.PhoneNumber,
            Department = user.Department,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt
        };

        return Ok(new LoginResponse
        {
            Token = token,
            User = userDto
        });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<CurrentUserDto>> GetCurrentUser()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return NotFound();
        }

        return Ok(new CurrentUserDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role.ToString(),
            AvatarUrl = user.AvatarUrl,
            MonthlyQuota = user.MonthlyQuota,
            Department = user.Department
        });
    }

    [HttpGet("demo-accounts")]
    public async Task<ActionResult<IEnumerable<object>>> GetDemoAccounts()
    {
        var users = await _context.Users
            .Where(u => u.IsActive)
            .Select(u => new
            {
                u.Id,
                u.FullName,
                u.Email,
                Role = u.Role.ToString(),
                u.AvatarUrl,
                u.Department,
                DefaultPassword = u.Role == UserRole.Admin ? "Admin123!" :
                                  u.Role == UserRole.Manager ? "Manager123!" : "Rep123!"
            })
            .ToListAsync();

        return Ok(users);
    }
}
