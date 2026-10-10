using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalesCRM.Api.Data;
using SalesCRM.Api.DTOs;
using SalesCRM.Api.Models;

namespace SalesCRM.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly CrmDbContext _context;

    public UsersController(CrmDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
    {
        var startOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);

        var users = await _context.Users
            .Include(u => u.Deals)
            .Include(u => u.Sales)
            .OrderBy(u => u.Role)
            .ThenBy(u => u.FullName)
            .ToListAsync();

        var result = users.Select(u => new UserDto
        {
            Id = u.Id,
            FullName = u.FullName,
            Email = u.Email,
            Role = u.Role,
            AvatarUrl = u.AvatarUrl,
            MonthlyQuota = u.MonthlyQuota,
            PhoneNumber = u.PhoneNumber,
            Department = u.Department,
            IsActive = u.IsActive,
            CreatedAt = u.CreatedAt,
            ActiveDealsCount = u.Deals.Count(d => d.Stage != DealStage.Won && d.Stage != DealStage.Lost),
            TotalSalesCurrentMonth = u.Sales.Where(s => s.ClosedDate >= startOfMonth).Sum(s => s.Amount)
        }).ToList();

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        var startOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
        var user = await _context.Users
            .Include(u => u.Deals)
            .Include(u => u.Sales)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
        {
            return NotFound();
        }

        var dto = new UserDto
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
            CreatedAt = user.CreatedAt,
            ActiveDealsCount = user.Deals.Count(d => d.Stage != DealStage.Won && d.Stage != DealStage.Lost),
            TotalSalesCurrentMonth = user.Sales.Where(s => s.ClosedDate >= startOfMonth).Sum(s => s.Amount)
        };

        return Ok(dto);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.FullName) || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Full name, email and password are required." });
        }

        var exists = await _context.Users.AnyAsync(u => u.Email.ToLower() == request.Email.ToLower().Trim());
        if (exists)
        {
            return BadRequest(new { message = "User with this email already exists." });
        }

        var user = new User
        {
            FullName = request.FullName.Trim(),
            Email = request.Email.ToLower().Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = request.Role,
            MonthlyQuota = request.MonthlyQuota,
            PhoneNumber = request.PhoneNumber?.Trim() ?? string.Empty,
            Department = string.IsNullOrWhiteSpace(request.Department) ? "Direct Sales" : request.Department.Trim(),
            AvatarUrl = string.IsNullOrWhiteSpace(request.AvatarUrl)
                ? $"https://api.dicebear.com/7.x/initials/svg?seed={Uri.EscapeDataString(request.FullName.Trim())}"
                : request.AvatarUrl.Trim(),
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, new UserDto
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
        });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserRequest request)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound();
        }

        user.FullName = request.FullName.Trim();
        user.Role = request.Role;
        user.MonthlyQuota = request.MonthlyQuota;
        user.PhoneNumber = request.PhoneNumber?.Trim() ?? string.Empty;
        user.Department = request.Department.Trim();
        user.IsActive = request.IsActive;

        if (!string.IsNullOrWhiteSpace(request.NewPassword))
        {
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }
}
