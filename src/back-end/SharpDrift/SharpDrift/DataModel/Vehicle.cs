using System;
using Insight.Database;

namespace SharpDrift.DataModel
{
    public abstract class MyDbObjectSerializer : DbObjectSerializer
    {
        public override object SerializeObject(Type type, object o)
        {
            return o.ToString()[0];
        }

        public override object DeserializeObject(Type type, object encoded)
        {
            return Enum.Parse(typeof(BV), (string)encoded);
        }
    }

    public enum BV
    {
        A,
        M
    }

    public class Vehicle
    {
        public int IdClient { get; set; }
        public int IdVehicle { get; set; }
        public String Name { get; set; }
        
        [Column(SerializationMode = SerializationMode.Custom, Serializer = typeof(MyDbObjectSerializer))]
        public BV BV { get; set; }
        public bool Animals { get; set; }
        public bool Smoking { get; set; }
        public bool Eat { get; set; }
    }
}
