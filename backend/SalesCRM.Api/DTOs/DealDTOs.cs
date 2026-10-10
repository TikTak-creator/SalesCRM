using SalesCRM.Api.Models;

namespace SalesCRM.Api.DTOs;

public class DealDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public int ClientId { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string ClientCompany { get; set; } = string.Empty;
    public int AssignedUserId { get; set; }
    public string AssignedUserName { get; set; } = string.Empty;
    public string? AssignedUserAvatar { get; set; }
    public decimal Amount { get; set; }
    public DealStage Stage { get; set; }
    public string StageName => Stage.ToString();
    public int Probability { get; set; }
    public DealPriority Priority { get; set; }
    public string PriorityName => Priority.ToString();
    public DateTime? ExpectedCloseDate { get; set; }
    public DateTime? ClosedAt { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<DealActivityDto> Activities { get; set; } = new();
}

public class CreateDealRequest
{
    public string Title { get; set; } = string.Empty;
    public int ClientId { get; set; }
    public int AssignedUserId { get; set; }
    public decimal Amount { get; set; }
    public DealStage Stage { get; set; } = DealStage.Lead;
    public int Probability { get; set; } = 25;
    public DealPriority Priority { get; set; } = DealPriority.Medium;
    public DateTime? ExpectedCloseDate { get; set; }
    public string Description { get; set; } = string.Empty;
}

public class UpdateDealRequest
{
    public string Title { get; set; } = string.Empty;
    public int ClientId { get; set; }
    public int AssignedUserId { get; set; }
    public decimal Amount { get; set; }
    public DealStage Stage { get; set; }
    public int Probability { get; set; }
    public DealPriority Priority { get; set; }
    public DateTime? ExpectedCloseDate { get; set; }
    public string Description { get; set; } = string.Empty;
}

public class UpdateDealStageRequest
{
    public DealStage Stage { get; set; }
    public string? Note { get; set; }
}

public class DealActivityDto
{
    public int Id { get; set; }
    public int DealId { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string? UserAvatar { get; set; }
    public ActivityType Type { get; set; }
    public string TypeName => Type.ToString();
    public string Description { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}

public class AddActivityRequest
{
    public ActivityType Type { get; set; } = ActivityType.Note;
    public string Description { get; set; } = string.Empty;
}
