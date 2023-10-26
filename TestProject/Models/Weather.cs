namespace TestProject.Models
{
    public class Weather
    {
        public int Id { get; set; }
        public string Date { get; set; }
        public string Time { get; set; }
        public double Temperature { get; set; }
        public double Humidity { get; set; }
        public double DewPoint { get; set; }
        public int Pressure { get; set; }
        public string? WindDirection { get; set; }
        public int? WindSpeed { get; set; }
        public int? CloudCover { get; set; }
        public int LowerCloudLimit { get; set; }
        public int? HorVisibility { get; set; }
        public string? Phenomena { get; set; }
    }
}
