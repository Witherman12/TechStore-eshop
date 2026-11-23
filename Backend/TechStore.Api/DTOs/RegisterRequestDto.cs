using System.ComponentModel.DataAnnotations;

namespace TechStore.Api.DTOs;

public class RegisterRequestDto
{
    [Required(ErrorMessage = "Το username είναι υποχρεωτικό.")]
    [MinLength(3, ErrorMessage = "Το username πρέπει να έχει τουλάχιστον 3 χαρακτήρες.")]
    [MaxLength(50, ErrorMessage = "Το username δεν μπορεί να υπερβαίνει τους 50 χαρακτήρες.")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Το email είναι υποχρεωτικό.")]
    [EmailAddress(ErrorMessage = "Μη έγκυρη μορφή email.")]
    [MaxLength(150, ErrorMessage = "Το email δεν μπορεί να υπερβαίνει τους 150 χαρακτήρες.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Ο κωδικός είναι υποχρεωτικός.")]
    [MinLength(6, ErrorMessage = "Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες.")]
    [MaxLength(100, ErrorMessage = "Ο κωδικός δεν μπορεί να υπερβαίνει τους 100 χαρακτήρες.")]
    public string Password { get; set; } = string.Empty;
}