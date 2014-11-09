using System;
using Nancy;
using Nancy.Responses;
using Nancy.Serialization.JsonNet;
using Newtonsoft.Json;

namespace SharpDrift.Utilities.Data
{
    public static class Json
    {
        public static JsonResponse Serialize(object o)
        {
            return new JsonResponse(o, new JsonNetSerializer(new CustomJsonSerializer()));
        }

        public static T Deserialize<T>(String s)
        {
            return JsonConvert.DeserializeObject<T>(s);
        }

        public static dynamic Deserialize(String s)
        {
            return JsonConvert.DeserializeObject(s);
        }
    }
}
