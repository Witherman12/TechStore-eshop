using System.ComponentModel.DataAnnotations;

namespace TechStore.Api.DTOs;

public class LoginRequestDto
{
    [Required(ErrorMessage = "Το username είναι υποχρεωτικό.")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Ο κωδικός είναι υποχρεωτικός.")]
    public string Password { get; set; } = string.Empty;
}