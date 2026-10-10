using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using SalesCRM.Api.Models;

namespace SalesCRM.Api.Services;

public class JwtService : IJwtService
{
    private readonly IConfiguration _config;

    public JwtService(IConfiguration config)
    {
        _config = config;
    }

    public string GenerateToken(User user)
    {
        var secretKey = _config["Jwt:Key"] ?? "SalesCRM_Super_Secret_Jwt_Key_2026_Enterprise_Edition_Secure_Token_Key!";
        var issuer = _config["Jwt:Issuer"] ?? "SalesCRM.Api";
        var audience = _config["Jwt:Audience"] ?? "SalesCRM.Client";
        var expireHours = int.TryParse(_config["Jwt:ExpireHours"], out var hours) ? hours : 24;

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim("Department", user.Department),
            new Claim("AvatarUrl", user.AvatarUrl ?? "")
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(expireHours),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
