using fake_wiseflow_be.Models;
using fake_wiseflow_be.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace fake_wiseflow_be.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly SignInManager<User> _signIn;
    private readonly UserManager<User> _users;

    public AuthController(SignInManager<User> signIn, UserManager<User> users)
    {
        _signIn = signIn;
        _users = users;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var user = new User { UserName = registerDto.Email, Email = registerDto.Email, Role = UserRole.Student };
        var result = await _users.CreateAsync(user, registerDto.Password);
        if (!result.Succeeded) return BadRequest(result.Errors);

        await _users.AddToRoleAsync(user, UserRole.Student.ToString());
        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var result = await _signIn.PasswordSignInAsync(dto.Email, dto.Password,
            isPersistent: true, lockoutOnFailure: true);

        if (!result.Succeeded) return Unauthorized(new { message = "Invalid credentials" });

        return Ok();
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _signIn.SignOutAsync();
        return Ok();
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        var name = User.Identity?.Name;
        if (string.IsNullOrEmpty(name))
        {
            return Unauthorized();
        }

        var user = await _users.FindByNameAsync(name);
        if (user is null)
        {
            return Unauthorized();
        }

        var roles = await _users.GetRolesAsync(user);
        return Ok(new { user.Id, user.Email, user.UserName, Roles = roles });
    }
}