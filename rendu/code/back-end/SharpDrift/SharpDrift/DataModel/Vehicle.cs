using System;

namespace SharpDrift.DataModel
{
    public enum BV
    {
        A,
        M
    }

    public class Vehicle
    {
        public int IdClient { get; set; }
        public int IdVehicle { get; set; }
        public string Name { get; set; }
        public BV BV { get; set; }
        public bool Animals { get; set; }
        public bool Smoking { get; set; }
        public bool Eat { get; set; }
    }
}