using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SalesCRM.Api.Data;
using SalesCRM.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Add MySQL DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<CrmDbContext>(options =>
{
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
});

// 2. Add JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "SalesCRM_Super_Secret_Jwt_Key_2026_Enterprise_Edition_Secure_Token_Key!";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "SalesCRM.Api";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "SalesCRM.Client";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// 3. Register Application Services
builder.Services.AddScoped<IJwtService, JwtService>();

// 4. Add Controllers & JSON Options
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

// 5. Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// 6. Add Swagger with JWT Support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Sales CRM Enterprise API",
        Version = "v1.0",
        Description = "Enterprise Sales CRM RESTful Web API with JWT Authentication, Role-based Access, and Deal Pipeline management."
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: 'Bearer {token}'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Auto-migrate & seed database
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<CrmDbContext>();
    try
    {
        DbInitializer.Initialize(dbContext);
        Console.WriteLine("[INFO] Database successfully initialized and seeded.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[ERROR] Database initialization failed: {ex.Message}");
    }
}

// Configure pipeline
if (app.Environment.IsDevelopment() || true)
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Sales CRM API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors("AllowAll");

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("index.html");

app.Run();
