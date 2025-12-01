using AspNetCore.Identity.Mongo.Model;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace fake_wiseflow_be.Models;

// 1. Your User Class
public class User : MongoUser<Guid>
{
    public UserRole Role { get; set; }
    public Guid? InstitutionId { get; set; }

    public User()
    {
        Id = Guid.NewGuid();
    }
}

public class Role : MongoRole<Guid>
{
    public Role()
    {
        Id = Guid.NewGuid();
    }

    public Role(string roleName) : base(roleName)
    {
        Id = Guid.NewGuid();
    }
}

public enum UserRole
{
    Student,
    Examinator,
    InstitutionAdmin,
    SuperAdmin
}