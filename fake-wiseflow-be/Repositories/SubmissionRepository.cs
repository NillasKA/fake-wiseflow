using fake_wiseflow_be.Data;
using fake_wiseflow_be.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace fake_wiseflow_be.Repositories;

public class SubmissionRepository : ISubmissionRepository
{
    private readonly IMongoCollection<Submission> _submissionsCollection;

    public SubmissionRepository(
        IOptions<DatabaseSettings> dbSettings)
    {
        var mongoClient = new MongoClient(
            dbSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            dbSettings.Value.DatabaseName);

        _submissionsCollection = mongoDatabase.GetCollection<Submission>(
            dbSettings.Value.SubmissionsCollectionName);
    }
    
    public async Task<List<Submission>> GetAsync() =>
        await _submissionsCollection.Find(_ => true).ToListAsync();

    public async Task<Submission?> GetAsync(Guid id) =>
        await _submissionsCollection.Find(x => x.id == id).FirstOrDefaultAsync();
    
    public async Task<List<Submission>> GetByIdsAsync(List<Guid> ids) =>
        await _submissionsCollection.Find(x => ids.Contains(x.id)).ToListAsync();
    
    public async Task<List<Submission>> GetByUserIdAsync(Guid userId) =>
        await _submissionsCollection.Find(x => x.userId == userId).ToListAsync();

    public async Task CreateAsync(Submission newSubmission) =>
        await _submissionsCollection.InsertOneAsync(newSubmission);
    
    public async Task CreateBulkAsync(List<Submission> submissions) =>
        await _submissionsCollection.InsertManyAsync(submissions);

    public async Task UpdateAsync(Guid id, Submission updatedSubmission) =>
        await _submissionsCollection.ReplaceOneAsync(x => x.id == id, updatedSubmission);
    

    public async Task RemoveAsync(Guid id) =>
        await _submissionsCollection.DeleteOneAsync(x => x.id == id);
}