using fake_wiseflow_be.Services;

public static class ServiceRegistry
{
    public static WebApplicationBuilder ActivateServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddScoped<IInstitutionService, InstitutionService>();
        builder.Services.AddScoped<IStudentService, StudentService>();
        builder.Services.AddScoped<IExaminatorService, ExaminatorService>();    
        return builder;
    }
}