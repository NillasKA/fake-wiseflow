using AspNetCore.Identity.Mongo;
using AspNetCore.Identity.Mongo.Model;
using DotNetEnv;
using fake_wiseflow_be.Data;
using fake_wiseflow_be.Models;
using fake_wiseflow_be.Repositories;
using Microsoft.AspNetCore.Identity;

Env.Load();

var builder = WebApplication.CreateBuilder(args);

// bind settings
builder.Services.Configure<DatabaseSettings>(
    builder.Configuration.GetSection("fake-wiseflow-db"));

var dbConfig = builder.Configuration.GetSection("fake-wiseflow-db").Get<DatabaseSettings>()!;

builder.Services.AddSingleton<ExamRepository>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddIdentityMongoDbProvider<User>(
    mongo => mongo.ConnectionString = dbConfig.ConnectionString);

var app = builder.Build();

app.Lifetime.ApplicationStarted.Register(async () =>
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

app.MapControllers();

app.Run();
Console.WriteLine($"Loaded connection: {Environment.GetEnvironmentVariable("fake-wiseflow-db__ConnectionString")}");