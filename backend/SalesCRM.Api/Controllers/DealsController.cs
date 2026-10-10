using System.Security.Claims;
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
public class DealsController : ControllerBase
{
    private readonly CrmDbContext _context;

    public DealsController(CrmDbContext context)
    {
        _context = context;
    }

    private int GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(claim, out var id) ? id : 1;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DealDto>>> GetDeals(
        [FromQuery] DealStage? stage,
        [FromQuery] int? assignedUserId,
        [FromQuery] string? search)
    {
        var query = _context.Deals
            .Include(d => d.Client)
            .Include(d => d.AssignedUser)
            .Include(d => d.Activities)
                .ThenInclude(a => a.User)
            .AsQueryable();

        if (stage.HasValue)
        {
            query = query.Where(d => d.Stage == stage.Value);
        }

        if (assignedUserId.HasValue)
        {
            query = query.Where(d => d.AssignedUserId == assignedUserId.Value);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.ToLower().Trim();
            query = query.Where(d => d.Title.ToLower().Contains(s) ||
                                     d.Client!.CompanyName.ToLower().Contains(s));
        }

        var deals = await query
            .OrderByDescending(d => d.UpdatedAt)
            .Select(d => new DealDto
            {
                Id = d.Id,
                Title = d.Title,
                ClientId = d.ClientId,
                ClientName = d.Client != null ? d.Client.ContactPerson : "",
                ClientCompany = d.Client != null ? d.Client.CompanyName : "",
                AssignedUserId = d.AssignedUserId,
                AssignedUserName = d.AssignedUser != null ? d.AssignedUser.FullName : "",
                AssignedUserAvatar = d.AssignedUser != null ? d.AssignedUser.AvatarUrl : null,
                Amount = d.Amount,
                Stage = d.Stage,
                Probability = d.Probability,
                Priority = d.Priority,
                ExpectedCloseDate = d.ExpectedCloseDate,
                ClosedAt = d.ClosedAt,
                Description = d.Description,
                CreatedAt = d.CreatedAt,
                UpdatedAt = d.UpdatedAt,
                Activities = d.Activities
                    .OrderByDescending(a => a.Timestamp)
                    .Select(a => new DealActivityDto
                    {
                        Id = a.Id,
                        DealId = a.DealId,
                        UserId = a.UserId,
                        UserName = a.User != null ? a.User.FullName : "",
                        UserAvatar = a.User != null ? a.User.AvatarUrl : null,
                        Type = a.Type,
                        Description = a.Description,
                        Timestamp = a.Timestamp
                    }).ToList()
            })
            .ToListAsync();

        return Ok(deals);
    }

    [HttpGet("kanban")]
    public async Task<ActionResult<Dictionary<string, List<DealDto>>>> GetKanbanBoard()
    {
        var deals = await _context.Deals
            .Include(d => d.Client)
            .Include(d => d.AssignedUser)
            .OrderByDescending(d => d.UpdatedAt)
            .Select(d => new DealDto
            {
                Id = d.Id,
                Title = d.Title,
                ClientId = d.ClientId,
                ClientName = d.Client != null ? d.Client.ContactPerson : "",
                ClientCompany = d.Client != null ? d.Client.CompanyName : "",
                AssignedUserId = d.AssignedUserId,
                AssignedUserName = d.AssignedUser != null ? d.AssignedUser.FullName : "",
                AssignedUserAvatar = d.AssignedUser != null ? d.AssignedUser.AvatarUrl : null,
                Amount = d.Amount,
                Stage = d.Stage,
                Probability = d.Probability,
                Priority = d.Priority,
                ExpectedCloseDate = d.ExpectedCloseDate,
                ClosedAt = d.ClosedAt,
                Description = d.Description,
                CreatedAt = d.CreatedAt,
                UpdatedAt = d.UpdatedAt
            })
            .ToListAsync();

        var stages = Enum.GetValues<DealStage>();
        var result = new Dictionary<string, List<DealDto>>();

        foreach (var stage in stages)
        {
            result[stage.ToString()] = deals.Where(d => d.Stage == stage).ToList();
        }

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<DealDto>> GetDeal(int id)
    {
        var deal = await _context.Deals
            .Include(d => d.Client)
            .Include(d => d.AssignedUser)
            .Include(d => d.Activities)
                .ThenInclude(a => a.User)
            .FirstOrDefaultAsync(d => d.Id == id);

        if (deal == null)
        {
            return NotFound();
        }

        var dto = new DealDto
        {
            Id = deal.Id,
            Title = deal.Title,
            ClientId = deal.ClientId,
            ClientName = deal.Client?.ContactPerson ?? "",
            ClientCompany = deal.Client?.CompanyName ?? "",
            AssignedUserId = deal.AssignedUserId,
            AssignedUserName = deal.AssignedUser?.FullName ?? "",
            AssignedUserAvatar = deal.AssignedUser?.AvatarUrl,
            Amount = deal.Amount,
            Stage = deal.Stage,
            Probability = deal.Probability,
            Priority = deal.Priority,
            ExpectedCloseDate = deal.ExpectedCloseDate,
            ClosedAt = deal.ClosedAt,
            Description = deal.Description,
            CreatedAt = deal.CreatedAt,
            UpdatedAt = deal.UpdatedAt,
            Activities = deal.Activities
                .OrderByDescending(a => a.Timestamp)
                .Select(a => new DealActivityDto
                {
                    Id = a.Id,
                    DealId = a.DealId,
                    UserId = a.UserId,
                    UserName = a.User?.FullName ?? "",
                    UserAvatar = a.User?.AvatarUrl,
                    Type = a.Type,
                    Description = a.Description,
                    Timestamp = a.Timestamp
                }).ToList()
        };

        return Ok(dto);
    }

    [HttpPost]
    public async Task<ActionResult<DealDto>> CreateDeal([FromBody] CreateDealRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title) || request.ClientId <= 0 || request.AssignedUserId <= 0)
        {
            return BadRequest(new { message = "Title, ClientId, and AssignedUserId are required." });
        }

        var deal = new Deal
        {
            Title = request.Title.Trim(),
            ClientId = request.ClientId,
            AssignedUserId = request.AssignedUserId,
            Amount = request.Amount,
            Stage = request.Stage,
            Probability = request.Probability,
            Priority = request.Priority,
            ExpectedCloseDate = request.ExpectedCloseDate,
            Description = request.Description?.Trim() ?? string.Empty,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Deals.Add(deal);
        await _context.SaveChangesAsync();

        // Add initial activity
        var currentUserId = GetCurrentUserId();
        var activity = new DealActivity
        {
            DealId = deal.Id,
            UserId = currentUserId,
            Type = ActivityType.Note,
            Description = $"Deal created with initial stage: {deal.Stage}",
            Timestamp = DateTime.UtcNow
        };
        _context.DealActivities.Add(activity);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetDeal), new { id = deal.Id }, new DealDto
        {
            Id = deal.Id,
            Title = deal.Title,
            ClientId = deal.ClientId,
            AssignedUserId = deal.AssignedUserId,
            Amount = deal.Amount,
            Stage = deal.Stage,
            Probability = deal.Probability,
            Priority = deal.Priority,
            ExpectedCloseDate = deal.ExpectedCloseDate,
            Description = deal.Description,
            CreatedAt = deal.CreatedAt,
            UpdatedAt = deal.UpdatedAt
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDeal(int id, [FromBody] UpdateDealRequest request)
    {
        var deal = await _context.Deals.FindAsync(id);
        if (deal == null)
        {
            return NotFound();
        }

        deal.Title = request.Title.Trim();
        deal.ClientId = request.ClientId;
        deal.AssignedUserId = request.AssignedUserId;
        deal.Amount = request.Amount;
        deal.Stage = request.Stage;
        deal.Probability = request.Probability;
        deal.Priority = request.Priority;
        deal.ExpectedCloseDate = request.ExpectedCloseDate;
        deal.Description = request.Description?.Trim() ?? string.Empty;
        deal.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("{id}/stage")]
    public async Task<IActionResult> UpdateDealStage(int id, [FromBody] UpdateDealStageRequest request)
    {
        var deal = await _context.Deals
            .Include(d => d.Client)
            .FirstOrDefaultAsync(d => d.Id == id);

        if (deal == null)
        {
            return NotFound();
        }

        var oldStage = deal.Stage;
        deal.Stage = request.Stage;
        deal.UpdatedAt = DateTime.UtcNow;

        // Auto calculate default probability
        deal.Probability = request.Stage switch
        {
            DealStage.Lead => 20,
            DealStage.Contacted => 40,
            DealStage.ProposalSent => 60,
            DealStage.Negotiation => 80,
            DealStage.Won => 100,
            DealStage.Lost => 0,
            _ => deal.Probability
        };

        if (request.Stage == DealStage.Won)
        {
            deal.ClosedAt = DateTime.UtcNow;

            // Create SaleRecord if not already exists for this deal
            var existingSale = await _context.SaleRecords.FirstOrDefaultAsync(s => s.DealId == deal.Id);
            if (existingSale == null)
            {
                var sale = new SaleRecord
                {
                    DealId = deal.Id,
                    ClientId = deal.ClientId,
                    SalesRepId = deal.AssignedUserId,
                    Amount = deal.Amount,
                    ClosedDate = DateTime.UtcNow,
                    PaymentMethod = "Wire Transfer",
                    InvoiceNumber = $"INV-{DateTime.UtcNow:yyyyMM}-{deal.Id:D4}",
                    Notes = $"Automated closed sale record from deal: {deal.Title}"
                };
                _context.SaleRecords.Add(sale);
            }
        }
        else if (request.Stage == DealStage.Lost)
        {
            deal.ClosedAt = DateTime.UtcNow;
        }

        // Add stage change activity log
        var currentUserId = GetCurrentUserId();
        var activityNote = string.IsNullOrWhiteSpace(request.Note)
            ? $"Stage changed from {oldStage} to {request.Stage}"
            : $"Stage changed from {oldStage} to {request.Stage}. Note: {request.Note}";

        _context.DealActivities.Add(new DealActivity
        {
            DealId = deal.Id,
            UserId = currentUserId,
            Type = ActivityType.StageChange,
            Description = activityNote,
            Timestamp = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();
        return Ok(new { message = $"Stage updated to {request.Stage}", dealId = deal.Id, stage = deal.Stage.ToString() });
    }

    [HttpPost("{id}/activities")]
    public async Task<ActionResult<DealActivityDto>> AddActivity(int id, [FromBody] AddActivityRequest request)
    {
        var deal = await _context.Deals.FindAsync(id);
        if (deal == null)
        {
            return NotFound();
        }

        var currentUserId = GetCurrentUserId();
        var user = await _context.Users.FindAsync(currentUserId);

        var activity = new DealActivity
        {
            DealId = id,
            UserId = currentUserId,
            Type = request.Type,
            Description = request.Description.Trim(),
            Timestamp = DateTime.UtcNow
        };

        _context.DealActivities.Add(activity);
        deal.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new DealActivityDto
        {
            Id = activity.Id,
            DealId = activity.DealId,
            UserId = currentUserId,
            UserName = user?.FullName ?? "Unknown",
            UserAvatar = user?.AvatarUrl,
            Type = activity.Type,
            Description = activity.Description,
            Timestamp = activity.Timestamp
        });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> DeleteDeal(int id)
    {
        var deal = await _context.Deals.FindAsync(id);
        if (deal == null)
        {
            return NotFound();
        }

        _context.Deals.Remove(deal);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
