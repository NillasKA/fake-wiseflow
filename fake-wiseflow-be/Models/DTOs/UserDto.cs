namespace fake_wiseflow_be.Models.DTOs;

public class StudentDto
{
    public string Id { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string UserName { get; set; } = default!;
    public string Role { get; set; } = default!;
}

public class CreateStudentResult
{
    public string Id { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string UserName { get; set; } = default!;
    public string Role { get; set; } = default!;
    public string TemporaryPassword { get; set; } = default!;
    public string Message { get; set; } = default!;
}