using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharpDrift.DataModel
{
    public class CarPooling
    {
        public int IdCarPooling { get; set; }
        public String Address { get; set; }
        public float Long { get; set; }
        public float Lat { get; set; }
        public int IdClient { get; set; }
        public int IdVehicle { get; set; }
        public int IdCampus { get; set; }
        public bool CampusToAddress { get; set; }
        public int Room { get; set; }
        public int Luggage { get; set; }
        public DateTime MeetTime { get; set; }
        public int Price { get; set; }
    }
}
