namespace TestProject.Services.Interfaces
{
    public interface IFileHandler
    {
        Task<int> HandleFiles(IFormFileCollection files);
    }
}
