using AspNetCore.Identity.Mongo;
using AspNetCore.Identity.Mongo.Model;
using DotNetEnv;
using fake_wiseflow_be.Data;
using fake_wiseflow_be.DependencyInjection;
using fake_wiseflow_be.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.OpenApi.Models;

Env.Load();

var builder = WebApplication.CreateBuilder(args)
    .ActivateServices()
    .ActivateRepositories();

builder.Services.Configure<DatabaseSettings>(
    builder.Configuration.GetSection("fake-wiseflow-db"));

var dbConfig = builder.Configuration.GetSection("fake-wiseflow-db").Get<DatabaseSettings>()!;

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("cookieAuth", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.ApiKey,
        In = ParameterLocation.Cookie,
        Name = ".AspNetCore.Identity.Application",
        Description = "Cookie auth. First POST /api/auth/login to get the auth cookie."
    });
});

builder.Services.AddIdentityMongoDbProvider<User>(
    mongo => mongo.ConnectionString = dbConfig.ConnectionString);

var app = builder.Build();

app.Lifetime.ApplicationStarted.Register(async void () =>
{
    using var scope = app.Services.CreateScope();
    var roleMgr = scope.ServiceProvider.GetRequiredService<RoleManager<MongoRole>>();

    foreach (var roleName in Enum.GetNames(typeof(UserRole)))
    {
        if (!await roleMgr.RoleExistsAsync(roleName))
            await roleMgr.CreateAsync(new MongoRole(roleName));
    }
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
