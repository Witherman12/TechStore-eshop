using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using TechStore.Api.Data;
using Testcontainers.MySql;

namespace TechStore.IntegrationTests;

public class TechStoreWebApplicationFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly MySqlContainer _mysqlContainer = new MySqlBuilder("mysql:8.0")
        .WithDatabase("techstore_test")
        .WithUsername("testuser")
        .WithPassword("testpass")
        .Build();

    public async Task InitializeAsync()
    {
        await _mysqlContainer.StartAsync();

        Environment.SetEnvironmentVariable("ConnectionStrings__DefaultConnection", _mysqlContainer.GetConnectionString());
        Environment.SetEnvironmentVariable("Jwt__Key", "IntegrationTest_SuperSecret_JwtKey_2026_AtLeast32Chars!");
        Environment.SetEnvironmentVariable("Jwt__Issuer", "TechStore.Api");
        Environment.SetEnvironmentVariable("Jwt__Audience", "TechStore.Client");
        Environment.SetEnvironmentVariable("Jwt__ExpiryMinutes", "60");

        using var scope = Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await dbContext.Database.MigrateAsync();
    }

    async Task IAsyncLifetime.DisposeAsync()
    {
        await base.DisposeAsync();
        await _mysqlContainer.DisposeAsync();

        Environment.SetEnvironmentVariable("ConnectionStrings__DefaultConnection", null);
        Environment.SetEnvironmentVariable("Jwt__Key", null);
        Environment.SetEnvironmentVariable("Jwt__Issuer", null);
        Environment.SetEnvironmentVariable("Jwt__Audience", null);
        Environment.SetEnvironmentVariable("Jwt__ExpiryMinutes", null);
    }
}