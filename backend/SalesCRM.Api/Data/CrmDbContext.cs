using Microsoft.EntityFrameworkCore;
using SalesCRM.Api.Models;

namespace SalesCRM.Api.Data;

public class CrmDbContext : DbContext
{
    public CrmDbContext(DbContextOptions<CrmDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Deal> Deals => Set<Deal>();
    public DbSet<DealActivity> DealActivities => Set<DealActivity>();
    public DbSet<SaleRecord> SaleRecords => Set<SaleRecord>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.MonthlyQuota).HasPrecision(18, 2);
        });

        // Client
        modelBuilder.Entity<Client>(entity =>
        {
            entity.HasOne(c => c.AssignedUser)
                .WithMany(u => u.Clients)
                .HasForeignKey(c => c.AssignedUserId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Deal
        modelBuilder.Entity<Deal>(entity =>
        {
            entity.Property(d => d.Amount).HasPrecision(18, 2);

            entity.HasOne(d => d.Client)
                .WithMany(c => c.Deals)
                .HasForeignKey(d => d.ClientId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(d => d.AssignedUser)
                .WithMany(u => u.Deals)
                .HasForeignKey(d => d.AssignedUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // DealActivity
        modelBuilder.Entity<DealActivity>(entity =>
        {
            entity.HasOne(a => a.Deal)
                .WithMany(d => d.Activities)
                .HasForeignKey(a => a.DealId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(a => a.User)
                .WithMany()
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // SaleRecord
        modelBuilder.Entity<SaleRecord>(entity =>
        {
            entity.Property(s => s.Amount).HasPrecision(18, 2);

            entity.HasOne(s => s.SalesRep)
                .WithMany(u => u.Sales)
                .HasForeignKey(s => s.SalesRepId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(s => s.Client)
                .WithMany()
                .HasForeignKey(s => s.ClientId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(s => s.Deal)
                .WithMany()
                .HasForeignKey(s => s.DealId)
                .OnDelete(DeleteBehavior.SetNull);
        });
    }
}
