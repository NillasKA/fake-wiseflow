using fake_wiseflow_be.Models;
using fake_wiseflow_be.Services;
using Microsoft.AspNetCore.Mvc;

namespace fake_wiseflow_be.Controllers;

[ApiController]
//[Authorize(Roles = "InstitutionAdmin, SuperAdmin")]
[Route("api/[controller]")]
public class InstitutionsController : ControllerBase
{
    private readonly IInstitutionService _institutionService;

    public InstitutionsController(IInstitutionService institutionService)
    {
        _institutionService = institutionService;
    }

    [HttpGet]
    public async Task<IEnumerable<Institution>> Get()
    {
        return await _institutionService.GetAllAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Institution>> Get(Guid id)
    {
        var institution = await _institutionService.GetByIdAsync(id);

        if (institution is null)
        {
            return NotFound();
        }

        return institution;
    }
    
    [HttpPost]
    public async Task<IActionResult> Post(Institution newInstitution)
    {
        await _institutionService.CreateAsync(newInstitution);

        return Ok(newInstitution);
    }

    [HttpPut]
    public async Task<IActionResult> Update(Guid id, Institution updatedInstitution)
    {
        var institution = await _institutionService.GetByIdAsync(id);

        if (institution is null)
        {
            return NotFound();
        }

        updatedInstitution.id = institution.id;

        await _institutionService.UpdateAsync(id, updatedInstitution);

        return Ok(updatedInstitution);
    }

    [HttpDelete]
    public async Task<IActionResult> Delete(Guid id)
    {
        var exam = await _institutionService.GetByIdAsync(id);

        if (exam is null)
        {
            return NotFound();
        }

        await _institutionService.RemoveAsync(id);

        return Ok($"Removed institution with ID: {id}");
    }
    
}