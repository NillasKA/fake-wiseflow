using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using fake_wiseflow_be.Services;
using fake_wiseflow_be.Repositories;
using fake_wiseflow_be.Models;

namespace fake_wiseflow_be.Tests.Services
{
    [TestClass]
    public class InstitutionServiceTests
    {
        private Mock<IInstitutionRepository> _mockRepository;
        private InstitutionService _service;

        [TestInitialize]
        public void Setup()
        {
            _mockRepository = new Mock<IInstitutionRepository>();
            _service = new InstitutionService(_mockRepository.Object);
        }

        [TestMethod]
        public async Task GetAllAsync_ReturnsAllInstitutions()
        {
            // Arrange
            var expectedInstitutions = new List<Institution>
            {
                new Institution { id = Guid.NewGuid(), name = "Test Institution 1" },
                new Institution { id = Guid.NewGuid(), name = "Test Institution 2" }
            };
            _mockRepository.Setup(r => r.GetAsync()).ReturnsAsync(expectedInstitutions);

            // Act
            var result = await _service.GetAllAsync();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Count);
            _mockRepository.Verify(r => r.GetAsync(), Times.Once);
        }

        [TestMethod]
        public async Task GetByIdAsync_ValidId_ReturnsInstitution()
        {
            // Arrange
            var institutionId = Guid.NewGuid();
            var expectedInstitution = new Institution { id = institutionId, name = "Test Institution" };
            _mockRepository.Setup(r => r.GetAsync(institutionId)).ReturnsAsync(expectedInstitution);

            // Act
            var result = await _service.GetByIdAsync(institutionId);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(institutionId, result.id);
            Assert.AreEqual("Test Institution", result.name);
        }

        [TestMethod]
        public async Task CreateAsync_ValidInstitution_CreatesSuccessfully()
        {
            // Arrange
            var newInstitution = new Institution { name = "New Institution" };
            _mockRepository.Setup(r => r.CreateAsync(It.IsAny<Institution>())).Returns(Task.CompletedTask);

            // Act
            await _service.CreateAsync(newInstitution);

            // Assert
            _mockRepository.Verify(r => r.CreateAsync(It.Is<Institution>(i => i.name == "New Institution")), Times.Once);
        }
    }
}