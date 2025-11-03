using fake_wiseflow_be.Models;
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
    public async Task<IActionResult> Register(string email, string password)
    {
        var user = new User { UserName = email, Email = email, Role = UserRole.Student };
        var result = await _users.CreateAsync(user, password);
        if (!result.Succeeded) return BadRequest(result.Errors);

        await _users.AddToRoleAsync(user, UserRole.Student.ToString());
        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(string email, string password)
    {
        var result = await _signIn.PasswordSignInAsync(email, password, isPersistent: false, lockoutOnFailure: false);
        return result.Succeeded ? Ok() : Unauthorized();
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _signIn.SignOutAsync();
        return Ok();
    }
}