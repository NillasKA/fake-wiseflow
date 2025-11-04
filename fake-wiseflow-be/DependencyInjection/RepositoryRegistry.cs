using fake_wiseflow_be.Repositories;

namespace fake_wiseflow_be.DependencyInjection;

public static class RepositoryRegistry
{
    public static WebApplicationBuilder ActivateRepositories(this WebApplicationBuilder builder)
    {
        //TODO: Lav Interface til ExamRepository
        builder.Services.AddScoped<ExamRepository>();
        builder.Services.AddScoped<IInstitutionRepository, InstitutionRepository>();
        return builder;
    }
}