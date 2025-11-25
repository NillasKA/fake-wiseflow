using fake_wiseflow_be.Models.DTOs;

namespace fake_wiseflow_be.Services;

public interface IStudentService
{
    Task<List<StudentDto>> GetAllStudentsAsync();
    Task<StudentDto?> GetStudentByIdAsync(Guid id);
    Task<CreateStudentResult> CreateStudentAsync(string email, Guid institutionId);

    Task<List<StudentDto>> GetStudentsByInstitutionAsync(Guid institutionId);
    Task<bool> DeleteStudentAsync(Guid id);
}

