using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using TestProject.Data;
using TestProject.Models;
using TestProject.Responses;
using TestProject.Services.Interfaces;

namespace TestProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WeathersController : ControllerBase
    {
        private readonly WeatherContext _context;
        private readonly IFileHandler _excelWeatherHandler;

        public WeathersController(IFileHandler excelWeatherHandler, WeatherContext context)
        {
            _excelWeatherHandler = excelWeatherHandler;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<WeathersResponse>> Get(string? date, string? time, int skip = 0, int limit = 10)
        {
            if (_context.Weather == null)
            {
                return NotFound();
            }

            List<Weather> weathers = await _context.Weather
                .Where(w => date != null ? w.Date == date : true)
                .Where(w => time != null ? w.Time == time : true)
                .Skip(skip)
                .Take(limit)
                .ToListAsync();

            int total = await _context.Weather
                .Where(w => date != null ? w.Date == date : true)
                .Where(w => time != null ? w.Time == time : true)
                .CountAsync();

            return Ok(JsonConvert.SerializeObject(new WeathersResponse(total, weathers)));
        }

        [Route("uploadfiles")]
        [HttpPost]
        public async Task<ActionResult<UploadResponse>> UploadFiles(IFormFileCollection files)
        {
            try
            {
                int rows = await _excelWeatherHandler.HandleFiles(files);
                return Ok(JsonConvert.SerializeObject(new UploadResponse(rows)));
            } 
            catch
            {
                return BadRequest();
            }
        }
    }
}
