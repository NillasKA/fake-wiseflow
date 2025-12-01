using fake_wiseflow_be.Data;
using fake_wiseflow_be.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace fake_wiseflow_be.Repositories;

public class InstitutionRepository : IInstitutionRepository
{
    private readonly IMongoCollection<Institution> _institutionCollection;

    public InstitutionRepository(
        IOptions<DatabaseSettings> databseSettings)
    {
        var mongoClient = new MongoClient(
            databseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            databseSettings.Value.DatabaseName);

        _institutionCollection = mongoDatabase.GetCollection<Institution>(
            databseSettings.Value.InstitutionsCollectionName);
    }
    
    public async Task<List<Institution>> GetAsync() =>
        await _institutionCollection.Find(_ => true).ToListAsync();

    public async Task<Institution?> GetAsync(Guid id) =>
        await _institutionCollection.Find(x => x.id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(Institution newInstitution) =>
        await _institutionCollection.InsertOneAsync(newInstitution);

    public async Task UpdateAsync(Guid id, Institution updatedInstitution) =>
        await _institutionCollection.ReplaceOneAsync(x => x.id == id, updatedInstitution);

    public async Task RemoveAsync(Guid id) =>
        await _institutionCollection.DeleteOneAsync(x => x.id == id);
}