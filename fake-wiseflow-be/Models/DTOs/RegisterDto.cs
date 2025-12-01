using System.ComponentModel.DataAnnotations;

namespace fake_wiseflow_be.Models.DTOs;

public class RegisterDto
{
    [Required, EmailAddress]
    public string Email { get; set; } = default!;

    [Required]
    public string Password { get; set; } = default!;
}