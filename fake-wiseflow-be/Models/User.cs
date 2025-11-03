using Microsoft.AspNetCore.Identity;

namespace fake_wiseflow_be.Models;

public class User : IdentityUser
{
    public UserRole Role { get; set; }

}

public enum UserRole
{
    Student,
    Examinator,
    InstitutionAdmin,
    SuperAdmin
}



