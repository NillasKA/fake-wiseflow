using AspNetCore.Identity.Mongo.Model;
using Microsoft.AspNetCore.Identity;
using MongoDB.Driver;

namespace fake_wiseflow_be.Models;

public class User : MongoUser
{
    public UserRole Role { get; set; }

    public Guid? InstitutionId { get; set; }

}

public enum UserRole
{
    Student,
    Examinator,
    InstitutionAdmin,
    SuperAdmin
}