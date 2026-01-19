using fake_wiseflow_be.Data;
using fake_wiseflow_be.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace fake_wiseflow_be.Repositories;

public class EvaluationRepository : IEvaluationRepository
{
    private readonly IMongoCollection<Evaluation> _evaluationsCollection;

    public EvaluationRepository(
        IOptions<DatabaseSettings> bookStoreDatabaseSettings)
    {
        var mongoClient = new MongoClient(
            bookStoreDatabaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            bookStoreDatabaseSettings.Value.DatabaseName);

        _evaluationsCollection = mongoDatabase.GetCollection<Evaluation>(
            bookStoreDatabaseSettings.Value.EvaluationsCollectionName);
    }

    public async Task<List<Evaluation>> GetAsync() =>
        await _evaluationsCollection.Find(_ => true).ToListAsync();

    public async Task<Evaluation?> GetAsync(Guid id) =>
        await _evaluationsCollection.Find(x => x.id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(Evaluation newEvaluation) =>
        await _evaluationsCollection.InsertOneAsync(newEvaluation);

    public async Task UpdateAsync(Guid id, Evaluation updatedEvaluation) =>
        await _evaluationsCollection.ReplaceOneAsync(x => x.id == id, updatedEvaluation);

    public async Task RemoveAsync(Guid id) =>
        await _evaluationsCollection.DeleteOneAsync(x => x.id == id);
}