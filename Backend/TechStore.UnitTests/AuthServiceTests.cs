using Microsoft.Extensions.Configuration;
using Moq;
using TechStore.Api.DTOs;
using TechStore.Api.Entities;
using TechStore.Api.Repositories;
using TechStore.Api.Services;

namespace TechStore.UnitTests;

public class AuthServiceTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();

        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "UnitTest_SuperSecret_JwtKey_2026_AtLeast32Chars!",
                ["Jwt:Issuer"] = "TechStore.Api",
                ["Jwt:Audience"] = "TechStore.Client",
                ["Jwt:ExpiryMinutes"] = "60"
            })
            .Build();

        _authService = new AuthService(_userRepositoryMock.Object, config);
    }

    [Fact]
    public async Task RegisterAsync_WithValidRequest_HashesPasswordWithBCryptAndReturnsJwt()
    {
        var request = new RegisterRequestDto
        {
            Username = "  panos_user  ",
            Email = "  PANOS@TechStore.gr ",
            Password = "Password123!"
        };

        _userRepositoryMock.Setup(r => r.ExistsByUsernameAsync("panos_user")).ReturnsAsync(false);
        _userRepositoryMock.Setup(r => r.ExistsByEmailAsync("panos@techstore.gr")).ReturnsAsync(false);

        var result = await _authService.RegisterAsync(request);

        Assert.NotNull(result);
        Assert.Equal("panos_user", result.Username);
        Assert.Equal("panos@techstore.gr", result.Email);
        Assert.Equal(UserRole.Customer.ToString(), result.Role);
        Assert.False(string.IsNullOrWhiteSpace(result.Token));
        Assert.True(result.ExpiresAt > DateTime.UtcNow);

        _userRepositoryMock.Verify(
            r => r.CreateAsync(It.Is<User>(u =>
                u.Username == "panos_user" &&
                u.Email == "panos@techstore.gr" &&
                u.Role == UserRole.Customer &&
                u.PasswordHash != request.Password &&
                BCrypt.Net.BCrypt.Verify(request.Password, u.PasswordHash))),
            Times.Once);
    }

    [Fact]
    public async Task RegisterAsync_WhenUsernameAlreadyExists_ThrowsInvalidOperationException()
    {
        var request = new RegisterRequestDto
        {
            Username = "existing_user",
            Email = "new@techstore.gr",
            Password = "Password123!"
        };

        _userRepositoryMock.Setup(r => r.ExistsByUsernameAsync("existing_user")).ReturnsAsync(true);

        await Assert.ThrowsAsync<InvalidOperationException>(() => _authService.RegisterAsync(request));

        _userRepositoryMock.Verify(r => r.CreateAsync(It.IsAny<User>()), Times.Never);
    }

    [Fact]
    public async Task RegisterAsync_WhenEmailAlreadyExists_ThrowsInvalidOperationException()
    {
        var request = new RegisterRequestDto
        {
            Username = "new_user",
            Email = "existing@techstore.gr",
            Password = "Password123!"
        };

        _userRepositoryMock.Setup(r => r.ExistsByUsernameAsync("new_user")).ReturnsAsync(false);
        _userRepositoryMock.Setup(r => r.ExistsByEmailAsync("existing@techstore.gr")).ReturnsAsync(true);

        await Assert.ThrowsAsync<InvalidOperationException>(() => _authService.RegisterAsync(request));

        _userRepositoryMock.Verify(r => r.CreateAsync(It.IsAny<User>()), Times.Never);
    }

    [Fact]
    public async Task LoginAsync_WithValidCredentials_ReturnsJwtResponse()
    {
        const string plainPassword = "Password123!";
        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = "panos_user",
            Email = "panos@techstore.gr",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(plainPassword),
            Role = UserRole.Customer,
            CreatedAt = DateTime.UtcNow
        };

        _userRepositoryMock.Setup(r => r.GetByUsernameAsync("panos_user")).ReturnsAsync(user);

        var result = await _authService.LoginAsync(new LoginRequestDto
        {
            Username = "panos_user",
            Password = plainPassword
        });

        Assert.NotNull(result);
        Assert.Equal(user.Id, result.UserId);
        Assert.Equal(user.Username, result.Username);
        Assert.Equal(user.Email, result.Email);
        Assert.Equal("Customer", result.Role);
        Assert.False(string.IsNullOrWhiteSpace(result.Token));
    }

    [Fact]
    public async Task LoginAsync_WithWrongPassword_ThrowsUnauthorizedAccessException()
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = "panos_user",
            Email = "panos@techstore.gr",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("CorrectPassword123!"),
            Role = UserRole.Customer,
            CreatedAt = DateTime.UtcNow
        };

        _userRepositoryMock.Setup(r => r.GetByUsernameAsync("panos_user")).ReturnsAsync(user);

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _authService.LoginAsync(new LoginRequestDto
        {
            Username = "panos_user",
            Password = "WrongPassword!"
        }));
    }

    [Fact]
    public async Task LoginAsync_WhenUserNotFound_ThrowsUnauthorizedAccessException()
    {
        _userRepositoryMock.Setup(r => r.GetByUsernameAsync("ghost_user")).ReturnsAsync((User?)null);

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _authService.LoginAsync(new LoginRequestDto
        {
            Username = "ghost_user",
            Password = "Password123!"
        }));
    }
}