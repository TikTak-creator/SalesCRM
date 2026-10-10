using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using SalesCRM.Api.Models;

namespace SalesCRM.Api.Data;

public static class DbInitializer
{
    public static void Initialize(CrmDbContext context)
    {
        context.Database.EnsureCreated();

        if (context.Users.Any())
        {
            return; // DB already seeded
        }

        // 1. Seed Users (Roles: Admin, Manager, SalesRep)
        var users = new List<User>
        {
            new User
            {
                FullName = "Alexander Wright",
                Email = "admin@salescrm.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                Role = UserRole.Admin,
                Department = "Executive Leadership",
                MonthlyQuota = 150000m,
                PhoneNumber = "+1 (555) 019-2831",
                AvatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-12)
            },
            new User
            {
                FullName = "Elena Rostova",
                Email = "manager@salescrm.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Manager123!"),
                Role = UserRole.Manager,
                Department = "Enterprise Sales",
                MonthlyQuota = 100000m,
                PhoneNumber = "+1 (555) 019-4822",
                AvatarUrl = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250",
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-10)
            },
            new User
            {
                FullName = "David Kim",
                Email = "david@salescrm.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Rep123!"),
                Role = UserRole.SalesRep,
                Department = "Direct Sales",
                MonthlyQuota = 60000m,
                PhoneNumber = "+1 (555) 019-7319",
                AvatarUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-8)
            },
            new User
            {
                FullName = "Sarah Jenkins",
                Email = "sarah@salescrm.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Rep123!"),
                Role = UserRole.SalesRep,
                Department = "Mid-Market Sales",
                MonthlyQuota = 50000m,
                PhoneNumber = "+1 (555) 019-9524",
                AvatarUrl = "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250",
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-6)
            },
            new User
            {
                FullName = "Michael Chen",
                Email = "michael@salescrm.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Rep123!"),
                Role = UserRole.SalesRep,
                Department = "Inbound Sales",
                MonthlyQuota = 45000m,
                PhoneNumber = "+1 (555) 019-1120",
                AvatarUrl = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-5)
            }
        };

        context.Users.AddRange(users);
        context.SaveChanges();

        var admin = users[0];
        var manager = users[1];
        var david = users[2];
        var sarah = users[3];
        var michael = users[4];

        // 2. Seed Clients
        var clients = new List<Client>
        {
            new Client
            {
                CompanyName = "Apex Global Logistics",
                ContactPerson = "Marcus Sterling",
                Email = "m.sterling@apexlogistics.io",
                Phone = "+1 (415) 890-1200",
                Industry = "Logistics & Supply Chain",
                Region = "North America",
                Status = ClientStatus.Active,
                AssignedUserId = david.Id,
                Notes = "Tier 1 enterprise account. Upgraded to fleet tracking v3 in Q2.",
                CreatedAt = DateTime.UtcNow.AddMonths(-7)
            },
            new Client
            {
                CompanyName = "Quantum Leap BioTech",
                ContactPerson = "Dr. Aris Thorne",
                Email = "a.thorne@quantumleapbio.com",
                Phone = "+1 (617) 441-9023",
                Industry = "Biotechnology",
                Region = "North America",
                Status = ClientStatus.Active,
                AssignedUserId = sarah.Id,
                Notes = "Requires HIPAA compliant cloud data lake integration.",
                CreatedAt = DateTime.UtcNow.AddMonths(-6)
            },
            new Client
            {
                CompanyName = "StripeSphere Payments",
                ContactPerson = "Camilla Rossi",
                Email = "c.rossi@stripesphere.eu",
                Phone = "+44 20 7946 0912",
                Industry = "FinTech",
                Region = "Europe",
                Status = ClientStatus.Active,
                AssignedUserId = david.Id,
                Notes = "Cross-border payment clearing engine integration.",
                CreatedAt = DateTime.UtcNow.AddMonths(-5)
            },
            new Client
            {
                CompanyName = "CyberVigilance Security",
                ContactPerson = "Nathaniel Drake",
                Email = "ndrake@cybervigilance.net",
                Phone = "+1 (202) 555-0182",
                Industry = "Cybersecurity",
                Region = "North America",
                Status = ClientStatus.Active,
                AssignedUserId = michael.Id,
                Notes = "GovTech contractor evaluating SOC automated incident response modules.",
                CreatedAt = DateTime.UtcNow.AddMonths(-5)
            },
            new Client
            {
                CompanyName = "CloudNova Solutions",
                ContactPerson = "Sophia Weber",
                Email = "sophia@cloudnova.de",
                Phone = "+49 30 1234567",
                Industry = "Cloud Infrastructure",
                Region = "Europe",
                Status = ClientStatus.Prospect,
                AssignedUserId = sarah.Id,
                Notes = "Interested in Kubernetes multicluster monitoring package.",
                CreatedAt = DateTime.UtcNow.AddMonths(-4)
            },
            new Client
            {
                CompanyName = "Vertex AI Systems",
                ContactPerson = "Jonathan Vance",
                Email = "jvance@vertexai.tech",
                Phone = "+1 (650) 932-4411",
                Industry = "Artificial Intelligence",
                Region = "North America",
                Status = ClientStatus.Lead,
                AssignedUserId = michael.Id,
                Notes = "Inbound lead from AI Summit 2026. Needs enterprise LLM orchestration pipeline.",
                CreatedAt = DateTime.UtcNow.AddMonths(-3)
            },
            new Client
            {
                CompanyName = "OmniRetail Global",
                ContactPerson = "Claire Beauchamp",
                Email = "claire.b@omniretail.fr",
                Phone = "+33 1 42 68 55 00",
                Industry = "Retail & E-Commerce",
                Region = "Europe",
                Status = ClientStatus.Prospect,
                AssignedUserId = david.Id,
                Notes = "Omnichannel checkout sync across 240 flagship stores.",
                CreatedAt = DateTime.UtcNow.AddMonths(-3)
            },
            new Client
            {
                CompanyName = "Nexus Telecom Group",
                ContactPerson = "Kenji Sato",
                Email = "k.sato@nexustelecom.jp",
                Phone = "+81 3 5555 0143",
                Industry = "Telecommunications",
                Region = "APAC",
                Status = ClientStatus.Active,
                AssignedUserId = manager.Id,
                Notes = "5G private network control software rollout.",
                CreatedAt = DateTime.UtcNow.AddMonths(-4)
            },
            new Client
            {
                CompanyName = "Helios Renewable Energy",
                ContactPerson = "Emma Lindqvist",
                Email = "emma.l@heliosrenew.se",
                Phone = "+46 8 123 4567",
                Industry = "CleanTech",
                Region = "Europe",
                Status = ClientStatus.Prospect,
                AssignedUserId = sarah.Id,
                Notes = "Solar farm IoT gateway analytics and predictive maintenance.",
                CreatedAt = DateTime.UtcNow.AddMonths(-2)
            },
            new Client
            {
                CompanyName = "Stratos Capital Partners",
                ContactPerson = "William Sterling",
                Email = "wsterling@stratoscap.com",
                Phone = "+1 (212) 555-0988",
                Industry = "Private Equity",
                Region = "North America",
                Status = ClientStatus.Lead,
                AssignedUserId = michael.Id,
                Notes = "Deal-flow pipeline tracking and automated LP reporting.",
                CreatedAt = DateTime.UtcNow.AddMonths(-1)
            },
            new Client
            {
                CompanyName = "Pulsar Aerospace",
                ContactPerson = "Robert Hughes",
                Email = "r.hughes@pulsaraero.com",
                Phone = "+1 (310) 555-4321",
                Industry = "Aerospace & Defense",
                Region = "North America",
                Status = ClientStatus.Prospect,
                AssignedUserId = david.Id,
                Notes = "High reliability telemetry data pipeline.",
                CreatedAt = DateTime.UtcNow.AddMonths(-2)
            },
            new Client
            {
                CompanyName = "Lumina Health Diagnostics",
                ContactPerson = "Dr. Maya Patel",
                Email = "mpatel@luminadiag.org",
                Phone = "+1 (773) 555-8765",
                Industry = "Healthcare",
                Region = "North America",
                Status = ClientStatus.Active,
                AssignedUserId = sarah.Id,
                Notes = "Cloud PACS imaging exchange license.",
                CreatedAt = DateTime.UtcNow.AddMonths(-3)
            }
        };

        context.Clients.AddRange(clients);
        context.SaveChanges();

        // 3. Seed Deals across Pipeline Stages
        var deals = new List<Deal>
        {
            // Lead stage
            new Deal
            {
                Title = "Enterprise LLM Pipeline License",
                ClientId = clients[5].Id, // Vertex AI
                AssignedUserId = michael.Id,
                Amount = 45000m,
                Stage = DealStage.Lead,
                Probability = 20,
                Priority = DealPriority.High,
                ExpectedCloseDate = DateTime.UtcNow.AddDays(45),
                Description = "Initial discovery call conducted. Scheduled technical architecture evaluation.",
                CreatedAt = DateTime.UtcNow.AddDays(-12),
                UpdatedAt = DateTime.UtcNow.AddDays(-2)
            },
            new Deal
            {
                Title = "Deal-flow Automated LP Portal",
                ClientId = clients[9].Id, // Stratos Capital
                AssignedUserId = michael.Id,
                Amount = 38000m,
                Stage = DealStage.Lead,
                Probability = 25,
                Priority = DealPriority.Medium,
                ExpectedCloseDate = DateTime.UtcNow.AddDays(60),
                Description = "Client requested white paper and case study on PE portfolio management.",
                CreatedAt = DateTime.UtcNow.AddDays(-8),
                UpdatedAt = DateTime.UtcNow.AddDays(-1)
            },

            // Contacted stage
            new Deal
            {
                Title = "Kubernetes Multicluster Monitoring Suite",
                ClientId = clients[4].Id, // CloudNova
                AssignedUserId = sarah.Id,
                Amount = 62000m,
                Stage = DealStage.Contacted,
                Probability = 40,
                Priority = DealPriority.High,
                ExpectedCloseDate = DateTime.UtcNow.AddDays(30),
                Description = "Held 45-min demo with VP of Infrastructure. High interest in Grafana integration.",
                CreatedAt = DateTime.UtcNow.AddDays(-20),
                UpdatedAt = DateTime.UtcNow.AddDays(-3)
            },
            new Deal
            {
                Title = "Aerospace Telemetry Cloud Stream",
                ClientId = clients[10].Id, // Pulsar Aerospace
                AssignedUserId = david.Id,
                Amount = 120000m,
                Stage = DealStage.Contacted,
                Probability = 35,
                Priority = DealPriority.Urgent,
                ExpectedCloseDate = DateTime.UtcNow.AddDays(40),
                Description = "ITAR compliance verified. Meeting with Chief Avionics Engineer next Tuesday.",
                CreatedAt = DateTime.UtcNow.AddDays(-15),
                UpdatedAt = DateTime.UtcNow.AddDays(-4)
            },

            // Proposal Sent stage
            new Deal
            {
                Title = "Omnichannel Checkout API Engine",
                ClientId = clients[6].Id, // OmniRetail
                AssignedUserId = david.Id,
                Amount = 85000m,
                Stage = DealStage.ProposalSent,
                Probability = 60,
                Priority = DealPriority.High,
                ExpectedCloseDate = DateTime.UtcNow.AddDays(20),
                Description = "Formal proposal and SLA contract sent to French procurement committee.",
                CreatedAt = DateTime.UtcNow.AddDays(-25),
                UpdatedAt = DateTime.UtcNow.AddDays(-5)
            },
            new Deal
            {
                Title = "Solar Farm IoT Predictive Gateway",
                ClientId = clients[8].Id, // Helios Renewable
                AssignedUserId = sarah.Id,
                Amount = 52000m,
                Stage = DealStage.ProposalSent,
                Probability = 65,
                Priority = DealPriority.Medium,
                ExpectedCloseDate = DateTime.UtcNow.AddDays(25),
                Description = "RFP response delivered. Review scheduled with CTO.",
                CreatedAt = DateTime.UtcNow.AddDays(-18),
                UpdatedAt = DateTime.UtcNow.AddDays(-2)
            },

            // Negotiation stage
            new Deal
            {
                Title = "SOC Automated Threat Response Module",
                ClientId = clients[3].Id, // CyberVigilance
                AssignedUserId = michael.Id,
                Amount = 78000m,
                Stage = DealStage.Negotiation,
                Probability = 80,
                Priority = DealPriority.Urgent,
                ExpectedCloseDate = DateTime.UtcNow.AddDays(10),
                Description = "Final legal redline review on indemnity clauses. Expecting signature this week.",
                CreatedAt = DateTime.UtcNow.AddDays(-35),
                UpdatedAt = DateTime.UtcNow.AddDays(-1)
            },
            new Deal
            {
                Title = "5G Private Core Management License",
                ClientId = clients[7].Id, // Nexus Telecom
                AssignedUserId = manager.Id,
                Amount = 145000m,
                Stage = DealStage.Negotiation,
                Probability = 85,
                Priority = DealPriority.Urgent,
                ExpectedCloseDate = DateTime.UtcNow.AddDays(12),
                Description = "Executive pricing approval granted. Finalizing multi-year discount schedule.",
                CreatedAt = DateTime.UtcNow.AddDays(-40),
                UpdatedAt = DateTime.UtcNow.AddDays(-2)
            },

            // Won stage (Recent)
            new Deal
            {
                Title = "Fleet Telematics v3 Global Upgrade",
                ClientId = clients[0].Id, // Apex Logistics
                AssignedUserId = david.Id,
                Amount = 94000m,
                Stage = DealStage.Won,
                Probability = 100,
                Priority = DealPriority.High,
                ClosedAt = DateTime.UtcNow.AddDays(-5),
                ExpectedCloseDate = DateTime.UtcNow.AddDays(-5),
                Description = "Contract signed! 3-year enterprise license with SLA tier Platinum.",
                CreatedAt = DateTime.UtcNow.AddDays(-60),
                UpdatedAt = DateTime.UtcNow.AddDays(-5)
            },
            new Deal
            {
                Title = "HIPAA Genomic Lakehouse Infrastructure",
                ClientId = clients[1].Id, // Quantum Leap
                AssignedUserId = sarah.Id,
                Amount = 76000m,
                Stage = DealStage.Won,
                Probability = 100,
                Priority = DealPriority.High,
                ClosedAt = DateTime.UtcNow.AddDays(-14),
                ExpectedCloseDate = DateTime.UtcNow.AddDays(-14),
                Description = "Deal closed successfully. Implementation kicked off with engineering.",
                CreatedAt = DateTime.UtcNow.AddDays(-50),
                UpdatedAt = DateTime.UtcNow.AddDays(-14)
            },
            new Deal
            {
                Title = "Cross-Border Clearing API Expansion",
                ClientId = clients[2].Id, // StripeSphere
                AssignedUserId = david.Id,
                Amount = 110000m,
                Stage = DealStage.Won,
                Probability = 100,
                Priority = DealPriority.Urgent,
                ClosedAt = DateTime.UtcNow.AddDays(-22),
                ExpectedCloseDate = DateTime.UtcNow.AddDays(-22),
                Description = "Won contract against competitor. Onboarding starts next Monday.",
                CreatedAt = DateTime.UtcNow.AddDays(-75),
                UpdatedAt = DateTime.UtcNow.AddDays(-22)
            },
            new Deal
            {
                Title = "Clinical PACS Cloud Exchange Pilot",
                ClientId = clients[11].Id, // Lumina Health
                AssignedUserId = sarah.Id,
                Amount = 48000m,
                Stage = DealStage.Won,
                Probability = 100,
                Priority = DealPriority.Medium,
                ClosedAt = DateTime.UtcNow.AddDays(-28),
                ExpectedCloseDate = DateTime.UtcNow.AddDays(-28),
                Description = "Pilot phase approved for 12 regional hospital nodes.",
                CreatedAt = DateTime.UtcNow.AddDays(-45),
                UpdatedAt = DateTime.UtcNow.AddDays(-28)
            },

            // Lost stage
            new Deal
            {
                Title = "Legacy Database Migration Tooling",
                ClientId = clients[6].Id,
                AssignedUserId = michael.Id,
                Amount = 32000m,
                Stage = DealStage.Lost,
                Probability = 0,
                Priority = DealPriority.Low,
                ClosedAt = DateTime.UtcNow.AddDays(-18),
                ExpectedCloseDate = DateTime.UtcNow.AddDays(-18),
                Description = "Client decided to build an internal in-house solution instead.",
                CreatedAt = DateTime.UtcNow.AddDays(-40),
                UpdatedAt = DateTime.UtcNow.AddDays(-18)
            }
        };

        context.Deals.AddRange(deals);
        context.SaveChanges();

        // 4. Seed Deal Activities
        var activities = new List<DealActivity>
        {
            new DealActivity
            {
                DealId = deals[0].Id,
                UserId = michael.Id,
                Type = ActivityType.Call,
                Description = "Discovery call with Jonathan Vance. Discussed latency limits for realtime streaming inference.",
                Timestamp = DateTime.UtcNow.AddDays(-10)
            },
            new DealActivity
            {
                DealId = deals[2].Id,
                UserId = sarah.Id,
                Type = ActivityType.Meeting,
                Description = "Architecture demonstration with CloudNova DevOps team. Walked through Prometheus exporter.",
                Timestamp = DateTime.UtcNow.AddDays(-12)
            },
            new DealActivity
            {
                DealId = deals[4].Id,
                UserId = david.Id,
                Type = ActivityType.Email,
                Description = "Dispatched formal enterprise proposal PDF and SOC-2 compliance attestation.",
                Timestamp = DateTime.UtcNow.AddDays(-5)
            },
            new DealActivity
            {
                DealId = deals[6].Id,
                UserId = michael.Id,
                Type = ActivityType.Meeting,
                Description = "Executive negotiation session with Chief Legal Officer. Concluded on limitation of liability terms.",
                Timestamp = DateTime.UtcNow.AddDays(-2)
            },
            new DealActivity
            {
                DealId = deals[8].Id,
                UserId = david.Id,
                Type = ActivityType.StageChange,
                Description = "Deal stage moved to Won. Signed agreement received and verified.",
                Timestamp = DateTime.UtcNow.AddDays(-5)
            }
        };

        context.DealActivities.AddRange(activities);

        // 5. Seed SaleRecords (Historical Sales for Charts: 6 months of data)
        var sales = new List<SaleRecord>
        {
            // Current month
            new SaleRecord
            {
                DealId = deals[8].Id,
                ClientId = clients[0].Id,
                SalesRepId = david.Id,
                Amount = 94000m,
                ClosedDate = DateTime.UtcNow.AddDays(-5),
                PaymentMethod = "Wire Transfer",
                InvoiceNumber = "INV-2026-0891",
                Notes = "Annual upfront enterprise license payment"
            },
            new SaleRecord
            {
                DealId = deals[9].Id,
                ClientId = clients[1].Id,
                SalesRepId = sarah.Id,
                Amount = 76000m,
                ClosedDate = DateTime.UtcNow.AddDays(-14),
                PaymentMethod = "Wire Transfer",
                InvoiceNumber = "INV-2026-0882",
                Notes = "Biotech cloud platform contract"
            },
            new SaleRecord
            {
                DealId = deals[10].Id,
                ClientId = clients[2].Id,
                SalesRepId = david.Id,
                Amount = 110000m,
                ClosedDate = DateTime.UtcNow.AddDays(-22),
                PaymentMethod = "ACH Transfer",
                InvoiceNumber = "INV-2026-0870",
                Notes = "European clearing gateway expansion"
            },
            new SaleRecord
            {
                DealId = deals[11].Id,
                ClientId = clients[11].Id,
                SalesRepId = sarah.Id,
                Amount = 48000m,
                ClosedDate = DateTime.UtcNow.AddDays(-28),
                PaymentMethod = "Wire Transfer",
                InvoiceNumber = "INV-2026-0855",
                Notes = "Lumina Diagnostics hospital imaging pilot"
            },

            // 1 month ago
            new SaleRecord
            {
                ClientId = clients[3].Id,
                SalesRepId = michael.Id,
                Amount = 64000m,
                ClosedDate = DateTime.UtcNow.AddMonths(-1).AddDays(5),
                PaymentMethod = "Wire Transfer",
                InvoiceNumber = "INV-2026-0790",
                Notes = "CyberVigilance annual licensing phase 1"
            },
            new SaleRecord
            {
                ClientId = clients[7].Id,
                SalesRepId = manager.Id,
                Amount = 125000m,
                ClosedDate = DateTime.UtcNow.AddMonths(-1).AddDays(12),
                PaymentMethod = "SWIFT",
                InvoiceNumber = "INV-2026-0785",
                Notes = "Nexus Telecom Tokyo infrastructure node"
            },
            new SaleRecord
            {
                ClientId = clients[0].Id,
                SalesRepId = david.Id,
                Amount = 55000m,
                ClosedDate = DateTime.UtcNow.AddMonths(-1).AddDays(20),
                PaymentMethod = "Wire Transfer",
                InvoiceNumber = "INV-2026-0761",
                Notes = "Apex Fleet maintenance add-on"
            },

            // 2 months ago
            new SaleRecord
            {
                ClientId = clients[2].Id,
                SalesRepId = david.Id,
                Amount = 88000m,
                ClosedDate = DateTime.UtcNow.AddMonths(-2).AddDays(3),
                PaymentMethod = "Wire Transfer",
                InvoiceNumber = "INV-2026-0699",
                Notes = "StripeSphere baseline connector"
            },
            new SaleRecord
            {
                ClientId = clients[4].Id,
                SalesRepId = sarah.Id,
                Amount = 52000m,
                ClosedDate = DateTime.UtcNow.AddMonths(-2).AddDays(15),
                PaymentMethod = "Wire Transfer",
                InvoiceNumber = "INV-2026-0684",
                Notes = "CloudNova initial cloud deployment"
            },

            // 3 months ago
            new SaleRecord
            {
                ClientId = clients[1].Id,
                SalesRepId = sarah.Id,
                Amount = 70000m,
                ClosedDate = DateTime.UtcNow.AddMonths(-3).AddDays(10),
                PaymentMethod = "Wire Transfer",
                InvoiceNumber = "INV-2026-0590",
                Notes = "Quantum Leap genomics initial pilot"
            },
            new SaleRecord
            {
                ClientId = clients[3].Id,
                SalesRepId = michael.Id,
                Amount = 45000m,
                ClosedDate = DateTime.UtcNow.AddMonths(-3).AddDays(22),
                PaymentMethod = "Credit Card",
                InvoiceNumber = "INV-2026-0571",
                Notes = "CyberVigilance consulting retainer"
            },

            // 4 months ago
            new SaleRecord
            {
                ClientId = clients[7].Id,
                SalesRepId = manager.Id,
                Amount = 98000m,
                ClosedDate = DateTime.UtcNow.AddMonths(-4).AddDays(8),
                PaymentMethod = "SWIFT",
                InvoiceNumber = "INV-2026-0480",
                Notes = "Nexus Telecom initial lab licensing"
            },
            new SaleRecord
            {
                ClientId = clients[0].Id,
                SalesRepId = david.Id,
                Amount = 60000m,
                ClosedDate = DateTime.UtcNow.AddMonths(-4).AddDays(18),
                PaymentMethod = "Wire Transfer",
                InvoiceNumber = "INV-2026-0465",
                Notes = "Apex fleet logistics sensor integration"
            },

            // 5 months ago
            new SaleRecord
            {
                ClientId = clients[2].Id,
                SalesRepId = david.Id,
                Amount = 75000m,
                ClosedDate = DateTime.UtcNow.AddMonths(-5).AddDays(14),
                PaymentMethod = "Wire Transfer",
                InvoiceNumber = "INV-2026-0370",
                Notes = "StripeSphere Q1 license"
            },
            new SaleRecord
            {
                ClientId = clients[11].Id,
                SalesRepId = sarah.Id,
                Amount = 42000m,
                ClosedDate = DateTime.UtcNow.AddMonths(-5).AddDays(25),
                PaymentMethod = "Wire Transfer",
                InvoiceNumber = "INV-2026-0352",
                Notes = "Lumina Health initial setup"
            }
        };

        context.SaleRecords.AddRange(sales);
        context.SaveChanges();
    }
}
