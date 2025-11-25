using AspNetCore.Identity.Mongo;
using AspNetCore.Identity.Mongo.Model;
using DotNetEnv;
using fake_wiseflow_be.Data;
using fake_wiseflow_be.DependencyInjection;
using fake_wiseflow_be.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.OpenApi.Models;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;

Env.Load();

var builder = WebApplication.CreateBuilder(args)
    .ActivateServices()
    .ActivateRepositories();

BsonSerializer.RegisterSerializer(new GuidSerializer(GuidRepresentation.Standard));

var allowedOrigins = new[]
{
    "http://localhost:5173", "https://localhost:5173",
    "http://localhost:3000", "https://localhost:3000"
};

builder.Services.AddCors(opt =>
{
    opt.AddPolicy("frontend", policy =>
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

// 1. DATABASE SETTINGS (Move this up so it's ready for Identity)
builder.Services.Configure<DatabaseSettings>(
    builder.Configuration.GetSection("fake-wiseflow-db"));
var dbConfig = builder.Configuration.GetSection("fake-wiseflow-db").Get<DatabaseSettings>()!;

// 2. ADD IDENTITY FIRST
// This registers the services and sets the default cookie settings (which we will override next)
builder.Services.AddIdentityMongoDbProvider<User>(
    mongo => mongo.ConnectionString = dbConfig.ConnectionString);

// 3. CONFIGURE THE IDENTITY COOKIE (The Fix)
// This overrides the defaults set by step 2.
builder.Services.ConfigureApplicationCookie(options =>
{
    // Prevent Redirect to "/Account/Login" on 401
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return Task.CompletedTask;
    };

    // Prevent Redirect to "/Account/AccessDenied" on 403
    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        return Task.CompletedTask;
    };

    // Cookie Settings
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.None; // Essential for cross-site/port
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; 
});

// Note: I removed the manual "builder.Services.AddAuthentication..." block 
// because Identity handles that internally.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("cookieAuth", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.ApiKey,
        In = ParameterLocation.Cookie,
        Name = ".AspNetCore.Identity.Application", // This is the default Identity cookie name
        Description = "Cookie auth. First POST /api/auth/login to get the auth cookie."
    });
});

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

app.UseCors("frontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();