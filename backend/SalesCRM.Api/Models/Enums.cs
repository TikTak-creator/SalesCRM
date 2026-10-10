namespace SalesCRM.Api.Models;

public enum UserRole
{
    Admin = 1,
    Manager = 2,
    SalesRep = 3
}

public enum ClientStatus
{
    Lead = 1,
    Active = 2,
    Prospect = 3,
    Churned = 4
}

public enum DealStage
{
    Lead = 1,
    Contacted = 2,
    ProposalSent = 3,
    Negotiation = 4,
    Won = 5,
    Lost = 6
}

public enum DealPriority
{
    Low = 1,
    Medium = 2,
    High = 3,
    Urgent = 4
}

public enum ActivityType
{
    Call = 1,
    Meeting = 2,
    Email = 3,
    Note = 4,
    StageChange = 5
}
