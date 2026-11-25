using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using TechStore.Api.DTOs;

namespace TechStore.IntegrationTests;

public class AuthIntegrationTests : IClassFixture<TechStoreWebApplicationFactory>
{
    private readonly HttpClient _client;

    public AuthIntegrationTests(TechStoreWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    private sealed record MeResponse(Guid UserId, string Username, string Email, string Role);

    [Fact]
    public async Task Register_WithValidData_Returns201CreatedAndJwt()
    {
        var suffix = Guid.NewGuid().ToString("N")[..8];
        var request = new RegisterRequestDto
        {
            Username = $"reg_{suffix}",
            Email = $"reg_{suffix}@techstore.gr",
            Password = "Password123!"
        };

        var response = await _client.PostAsJsonAsync("/api/auth/register", request);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var body = await response.Content.ReadFromJsonAsync<AuthResponseDto>();
        Assert.NotNull(body);
        Assert.Equal(request.Username, body.Username);
        Assert.Equal(request.Email, body.Email);
        Assert.Equal("Customer", body.Role);
        Assert.False(string.IsNullOrWhiteSpace(body.Token));
    }

    [Fact]
    public async Task Register_WithDuplicateUsername_Returns409Conflict()
    {
        var suffix = Guid.NewGuid().ToString("N")[..8];
        var firstRequest = new RegisterRequestDto
        {
            Username = $"dup_{suffix}",
            Email = $"dup1_{suffix}@techstore.gr",
            Password = "Password123!"
        };
        var duplicateRequest = new RegisterRequestDto
        {
            Username = $"dup_{suffix}",
            Email = $"dup2_{suffix}@techstore.gr",
            Password = "Password123!"
        };

        var firstResponse = await _client.PostAsJsonAsync("/api/auth/register", firstRequest);
        Assert.Equal(HttpStatusCode.Created, firstResponse.StatusCode);

        var secondResponse = await _client.PostAsJsonAsync("/api/auth/register", duplicateRequest);
        Assert.Equal(HttpStatusCode.Conflict, secondResponse.StatusCode);
    }

    [Fact]
    public async Task Login_WithValidCredentials_Returns200OkAndValidTokenForMeEndpoint()
    {
        var suffix = Guid.NewGuid().ToString("N")[..8];
        var registerRequest = new RegisterRequestDto
        {
            Username = $"login_{suffix}",
            Email = $"login_{suffix}@techstore.gr",
            Password = "Password123!"
        };

        var registerResponse = await _client.PostAsJsonAsync("/api/auth/register", registerRequest);
        Assert.Equal(HttpStatusCode.Created, registerResponse.StatusCode);

        var loginResponse = await _client.PostAsJsonAsync("/api/auth/login", new LoginRequestDto
        {
            Username = registerRequest.Username,
            Password = registerRequest.Password
        });

        Assert.Equal(HttpStatusCode.OK, loginResponse.StatusCode);

        var auth = await loginResponse.Content.ReadFromJsonAsync<AuthResponseDto>();
        Assert.NotNull(auth);
        Assert.False(string.IsNullOrWhiteSpace(auth.Token));

        using var meRequest = new HttpRequestMessage(HttpMethod.Get, "/api/auth/me");
        meRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", auth.Token);

        var meResponse = await _client.SendAsync(meRequest);
        Assert.Equal(HttpStatusCode.OK, meResponse.StatusCode);

        var me = await meResponse.Content.ReadFromJsonAsync<MeResponse>();
        Assert.NotNull(me);
        Assert.Equal(registerRequest.Username, me.Username);
        Assert.Equal(registerRequest.Email, me.Email);
        Assert.Equal("Customer", me.Role);
    }

    [Fact]
    public async Task Login_WithWrongPassword_Returns401Unauthorized()
    {
        var suffix = Guid.NewGuid().ToString("N")[..8];
        var registerRequest = new RegisterRequestDto
        {
            Username = $"fail_{suffix}",
            Email = $"fail_{suffix}@techstore.gr",
            Password = "CorrectPassword123!"
        };

        var registerResponse = await _client.PostAsJsonAsync("/api/auth/register", registerRequest);
        Assert.Equal(HttpStatusCode.Created, registerResponse.StatusCode);

        var loginResponse = await _client.PostAsJsonAsync("/api/auth/login", new LoginRequestDto
        {
            Username = registerRequest.Username,
            Password = "WrongPassword!"
        });

        Assert.Equal(HttpStatusCode.Unauthorized, loginResponse.StatusCode);
    }
}