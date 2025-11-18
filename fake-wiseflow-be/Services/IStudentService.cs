using fake_wiseflow_be.Models;

namespace fake_wiseflow_be.Services;

public interface IStudentService
{
    Task<List<StudentDto>> GetAllStudentsAsync();
    Task<StudentDto?> GetStudentByIdAsync(string id);
    Task<CreateStudentResult> CreateStudentAsync(string email);
    Task<bool> DeleteStudentAsync(string id);
}

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