using TestProject.Data;
using TestProject.Services.Interfaces;
using NPOI.SS.UserModel;
using TestProject.Models;

namespace TestProject.Services
{
    public class ExcelWeatherHandler : IFileHandler
    {
        private readonly WeatherContext _context;

        public ExcelWeatherHandler(WeatherContext context)
        {
            _context = context;
        }
        public async Task<int> HandleFiles(IFormFileCollection files)
        {
            List<Weather>? weathers = new List<Weather>();
            foreach (IFormFile file in files)
            {
                MemoryStream? stream = new MemoryStream();
                await file.CopyToAsync(stream);
                stream.Position = 0;
                IWorkbook? workbook = WorkbookFactory.Create(stream, ImportOption.SheetContentOnly);
                
                int n = workbook.NumberOfSheets;
                for (int i = 0; i < n; i++)
                {
                    ISheet? sheet = workbook.GetSheetAt(i);
                    int numRows = sheet.PhysicalNumberOfRows;
                    for (int j = 4; j < numRows; j++)
                    {
                        try
                        {
                            IRow? row = sheet.GetRow(j);
                            Weather weather = GetWeatherFromRow(row);
                            row = null;
                            weathers.Add(weather);
                        }
                        catch { }
                    }
                    sheet = null;
                }
                
                workbook.Close();
                workbook.Dispose();
                workbook = null;

                stream.Close();
                stream.Dispose();
                stream = null;
            }
            List<Weather> weathersInDb = _context.Weather.ToList();
            _context.AddRange(weathers.Where(w1 => !weathersInDb.Any(w2 => w1.Date == w2.Date && w1.Time == w2.Time)));
            try
            {
                return _context.SaveChanges();
            }
            catch
            {
                return 0;
            }
        }

        static private Weather GetWeatherFromRow(IRow row)
        {
            string date = row.GetCell(0).StringCellValue;
            string time = row.GetCell(1).StringCellValue;
            double temp = row.GetCell(2).NumericCellValue;
            double hum = row.GetCell(3).NumericCellValue;
            double dewP = row.GetCell(4).NumericCellValue;
            int pressure = (int)row.GetCell(5).NumericCellValue;
            string? windD;
            try
            {
                windD = row.GetCell(6).StringCellValue;
            }
            catch
            {
                windD = null;
            }
            int? windS;
            try
            {
                windS = (int)row.GetCell(7).NumericCellValue;
            } 
            catch 
            {
                windS = null;
            }
            int? cloudCover;
            try
            {
                cloudCover = (int)row.GetCell(8).NumericCellValue;
            }
            catch
            {
                cloudCover = null;
            }
            int lowerCloudLimit = (int)row.GetCell(9).NumericCellValue;
            int? horVisibility;
            try
            {
                horVisibility = (int)row.GetCell(10).NumericCellValue;
            }
            catch
            {
                horVisibility = null;
            }
            string? phenomena;
            try
            {
                phenomena = row.GetCell(11).StringCellValue;
            }
            catch
            {
                phenomena = null;
            }

            return new Weather
            {
                Date = date,
                Time = time,
                Temperature = temp,
                Humidity = hum,
                DewPoint = dewP,
                Pressure = pressure,
                WindDirection = windD?.Length > 0 ? windD : null,
                WindSpeed = windS,
                CloudCover = cloudCover,
                LowerCloudLimit = lowerCloudLimit,
                HorVisibility = horVisibility,
                Phenomena = phenomena?.Length > 0 ? phenomena : null
            };
        }
    }
}
