using System;

namespace SharpDrift.DataModel
{
    public class CarPooling
    {
        public int IdCarPooling { get; set; }
        public string Address { get; set; }
        public float Long { get; set; }
        public float Lat { get; set; }
        public int IdClient { get; set; }
        public int IdVehicle { get; set; }
        public int IdCampus { get; set; }
        public bool CampusToAddress { get; set; }
        public int Room { get; set; }
        public int Luggage { get; set; }
        public bool Talks { get; set; }
        public DateTime MeetTime { get; set; }
        public int Price { get; set; }
    }
}