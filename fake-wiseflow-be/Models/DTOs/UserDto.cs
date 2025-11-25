namespace fake_wiseflow_be.Models.DTOs;

// User DTOs
public class StudentDto
{
    public string Id { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string UserName { get; set; } = default!;
    public string Role { get; set; } = default!;
    public Guid? InstitutionId { get; set; }
}

public class CreateStudentResult
{
    public string Id { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string UserName { get; set; } = default!;
    public string Role { get; set; } = default!;
    public string TemporaryPassword { get; set; } = default!;
    public string Message { get; set; } = default!;
    public Guid? InstitutionId { get; set; }
}

public class CreateStudentRequest
{
    public string Email { get; set; } = default!;
    public Guid? InstitutionId { get; set; }
}

// Examinator DTOs
public class ExaminatorDto
{
    public string Id { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string UserName { get; set; } = default!;
    public string Role { get; set; } = default!;
    public Guid? InstitutionId { get; set; }
}

public class CreateExaminatorResult
{
    public string Id { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string UserName { get; set; } = default!;
    public string Role { get; set; } = default!;
    public string TemporaryPassword { get; set; } = default!;
    public string Message { get; set; } = default!;
    public Guid? InstitutionId { get; set; }
}

public class CreateExaminatorRequest
{
    public string Email { get; set; } = default!;
    public Guid? InstitutionId { get; set; }
}