using fake_wiseflow_be.Services;

namespace fake_wiseflow_be.DependencyInjection;

public static class ServiceRegistry
{
    public static WebApplicationBuilder ActivateServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddScoped<IInstitutionService, InstitutionService>();
        builder.Services.AddScoped<IStudentService, StudentService>();
        builder.Services.AddScoped<IExaminatorService, ExaminatorService>();    
        builder.Services.AddScoped<IPasswordGeneratorService, PasswordGeneratorService>();
        return builder;
    }
}