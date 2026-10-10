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
public class ClientsController : ControllerBase
{
    private readonly CrmDbContext _context;

    public ClientsController(CrmDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ClientDto>>> GetClients(
        [FromQuery] string? search,
        [FromQuery] ClientStatus? status,
        [FromQuery] string? industry,
        [FromQuery] int? assignedUserId)
    {
        var query = _context.Clients
            .Include(c => c.AssignedUser)
            .Include(c => c.Deals)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.ToLower().Trim();
            query = query.Where(c => c.CompanyName.ToLower().Contains(s) ||
                                     c.ContactPerson.ToLower().Contains(s) ||
                                     c.Email.ToLower().Contains(s));
        }

        if (status.HasValue)
        {
            query = query.Where(c => c.Status == status.Value);
        }

        if (!string.IsNullOrWhiteSpace(industry))
        {
            query = query.Where(c => c.Industry.ToLower() == industry.ToLower().Trim());
        }

        if (assignedUserId.HasValue)
        {
            query = query.Where(c => c.AssignedUserId == assignedUserId.Value);
        }

        var clients = await query
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new ClientDto
            {
                Id = c.Id,
                CompanyName = c.CompanyName,
                ContactPerson = c.ContactPerson,
                Email = c.Email,
                Phone = c.Phone,
                Industry = c.Industry,
                Region = c.Region,
                Status = c.Status,
                AssignedUserId = c.AssignedUserId,
                AssignedUserName = c.AssignedUser != null ? c.AssignedUser.FullName : null,
                Notes = c.Notes,
                CreatedAt = c.CreatedAt,
                DealsCount = c.Deals.Count,
                TotalDealValue = c.Deals.Sum(d => d.Amount)
            })
            .ToListAsync();

        return Ok(clients);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ClientDto>> GetClient(int id)
    {
        var client = await _context.Clients
            .Include(c => c.AssignedUser)
            .Include(c => c.Deals)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (client == null)
        {
            return NotFound();
        }

        var dto = new ClientDto
        {
            Id = client.Id,
            CompanyName = client.CompanyName,
            ContactPerson = client.ContactPerson,
            Email = client.Email,
            Phone = client.Phone,
            Industry = client.Industry,
            Region = client.Region,
            Status = client.Status,
            AssignedUserId = client.AssignedUserId,
            AssignedUserName = client.AssignedUser?.FullName,
            Notes = client.Notes,
            CreatedAt = client.CreatedAt,
            DealsCount = client.Deals.Count,
            TotalDealValue = client.Deals.Sum(d => d.Amount)
        };

        return Ok(dto);
    }

    [HttpPost]
    public async Task<ActionResult<ClientDto>> CreateClient([FromBody] CreateClientRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.CompanyName) || string.IsNullOrWhiteSpace(request.ContactPerson))
        {
            return BadRequest(new { message = "Company name and contact person are required." });
        }

        var client = new Client
        {
            CompanyName = request.CompanyName.Trim(),
            ContactPerson = request.ContactPerson.Trim(),
            Email = request.Email?.Trim() ?? string.Empty,
            Phone = request.Phone?.Trim() ?? string.Empty,
            Industry = string.IsNullOrWhiteSpace(request.Industry) ? "Technology" : request.Industry.Trim(),
            Region = string.IsNullOrWhiteSpace(request.Region) ? "North America" : request.Region.Trim(),
            Status = request.Status,
            AssignedUserId = request.AssignedUserId,
            Notes = request.Notes?.Trim() ?? string.Empty,
            CreatedAt = DateTime.UtcNow
        };

        _context.Clients.Add(client);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetClient), new { id = client.Id }, new ClientDto
        {
            Id = client.Id,
            CompanyName = client.CompanyName,
            ContactPerson = client.ContactPerson,
            Email = client.Email,
            Phone = client.Phone,
            Industry = client.Industry,
            Region = client.Region,
            Status = client.Status,
            AssignedUserId = client.AssignedUserId,
            Notes = client.Notes,
            CreatedAt = client.CreatedAt
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateClient(int id, [FromBody] UpdateClientRequest request)
    {
        var client = await _context.Clients.FindAsync(id);
        if (client == null)
        {
            return NotFound();
        }

        client.CompanyName = request.CompanyName.Trim();
        client.ContactPerson = request.ContactPerson.Trim();
        client.Email = request.Email?.Trim() ?? string.Empty;
        client.Phone = request.Phone?.Trim() ?? string.Empty;
        client.Industry = request.Industry.Trim();
        client.Region = request.Region.Trim();
        client.Status = request.Status;
        client.AssignedUserId = request.AssignedUserId;
        client.Notes = request.Notes?.Trim() ?? string.Empty;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> DeleteClient(int id)
    {
        var client = await _context.Clients.FindAsync(id);
        if (client == null)
        {
            return NotFound();
        }

        _context.Clients.Remove(client);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
