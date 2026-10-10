namespace SalesCRM.Api.DTOs;

public class DashboardMetricsDto
{
    public decimal TotalRevenue { get; set; }
    public decimal RevenueGrowthPercent { get; set; }
    public int DealsWonCount { get; set; }
    public decimal ActivePipelineValue { get; set; }
    public int ActiveDealsCount { get; set; }
    public decimal WinRatePercent { get; set; }
    public decimal AverageDealSize { get; set; }
    public int TotalClientsCount { get; set; }

    public List<MonthlyRevenueDto> RevenueVsTarget { get; set; } = new();
    public List<StageDistributionDto> PipelineStages { get; set; } = new();
    public List<LeaderboardItemDto> Leaderboard { get; set; } = new();
    public List<RecentActivityItemDto> RecentActivities { get; set; } = new();
    public List<RecentDealDto> RecentDeals { get; set; } = new();
    public List<CategoryStatDto> IndustryBreakdown { get; set; } = new();
}

public class MonthlyRevenueDto
{
    public string Month { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public decimal Target { get; set; }
    public int DealsCount { get; set; }
}

public class StageDistributionDto
{
    public string Stage { get; set; } = string.Empty;
    public int StageId { get; set; }
    public int DealsCount { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal Percentage { get; set; }
}

public class LeaderboardItemDto
{
    public int UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public decimal TotalWonRevenue { get; set; }
    public int WonDealsCount { get; set; }
    public decimal MonthlyQuota { get; set; }
    public decimal QuotaAttainmentPercent { get; set; }
    public decimal WinRatePercent { get; set; }
}

public class RecentDealDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Stage { get; set; } = string.Empty;
    public string AssignedUserName { get; set; } = string.Empty;
    public string? AssignedUserAvatar { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class RecentActivityItemDto
{
    public int Id { get; set; }
    public string DealTitle { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}

public class CategoryStatDto
{
    public string Category { get; set; } = string.Empty;
    public int Count { get; set; }
    public decimal TotalAmount { get; set; }
}

public class SaleHistoryDto
{
    public int Id { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public string ClientName { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string SalesRepName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime ClosedDate { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
}
