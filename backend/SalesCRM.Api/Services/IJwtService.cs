using SalesCRM.Api.Models;

namespace SalesCRM.Api.Services;

public interface IJwtService
{
    string GenerateToken(User user);
}
