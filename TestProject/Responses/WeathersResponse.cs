using TestProject.Models;

namespace TestProject.Responses
{
    public struct WeathersResponse
    {
        public int total;
        public List<Weather> weathers;

        public WeathersResponse(int total, List<Weather> weathers) 
        {
            this.total = total;
            this.weathers = weathers;
        }
    }
}
