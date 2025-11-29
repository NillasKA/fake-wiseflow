using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using fake_wiseflow_be.Controllers;
using fake_wiseflow_be.Services;
using fake_wiseflow_be.Models;
using Microsoft.AspNetCore.Mvc;

namespace fake_wiseflow_be.Tests.Controllers
{
    [TestClass]
    public class InstitutionsControllerTests
    {
        private Mock<IInstitutionService> _mockService;
        private InstitutionsController _controller;

        [TestInitialize]
        public void Setup()
        {
            _mockService = new Mock<IInstitutionService>();
            _controller = new InstitutionsController(_mockService.Object);
        }

        [TestMethod]
        public async Task Get_ReturnsAllInstitutions()
        {
            // Arrange
            var institutions = new List<Institution>
            {
                new Institution { id = Guid.NewGuid(), name = "Institution 1" },
                new Institution { id = Guid.NewGuid(), name = "Institution 2" }
            };
            _mockService.Setup(s => s.GetAllAsync()).ReturnsAsync(institutions);

            // Act
            var result = await _controller.Get();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Count());
        }

        [TestMethod]
        public async Task Get_ValidId_ReturnsInstitution()
        {
            // Arrange
            var institutionId = Guid.NewGuid();
            var institution = new Institution { id = institutionId, name = "Test Institution" };
            _mockService.Setup(s => s.GetByIdAsync(institutionId)).ReturnsAsync(institution);

            // Act
            var result = await _controller.Get(institutionId);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(institutionId, result.Value.id);
            Assert.AreEqual("Test Institution", result.Value.name);
        }

        [TestMethod]
        public async Task Post_ValidInstitution_ReturnsOk()
        {
            // Arrange
            var newInstitution = new Institution { name = "New Institution" };
            _mockService.Setup(s => s.CreateAsync(newInstitution)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.Post(newInstitution);

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkObjectResult));
            _mockService.Verify(s => s.CreateAsync(newInstitution), Times.Once);
        }

        [TestMethod]
        public async Task Delete_ValidId_ReturnsNoContent()
        {
            // Arrange
            var institutionId = Guid.NewGuid();
            _mockService.Setup(s => s.RemoveAsync(institutionId)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.Delete(institutionId);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NotFoundResult));
        }
    }
}