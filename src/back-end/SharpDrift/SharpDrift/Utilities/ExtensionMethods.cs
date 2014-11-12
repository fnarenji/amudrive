using System;
using Nancy;
using Nancy.Extensions;
using Nancy.Responses;
using Newtonsoft.Json;
using SharpDrift.Utilities.Data;

namespace SharpDrift.Utilities
{
    public static class ExtensionMethods
    {
        public static JsonResponse ToJson(this Object o)
        {
            return Json.Serialize(o);
        }

        public static bool Between(this IComparable a, IComparable b, IComparable c)
        {
            return a.CompareTo(b) >= 0 && a.CompareTo(c) <= 0;
        }

        public static T BindAnonymous<T>(this NancyModule m, T value)
        {
            return JsonConvert.DeserializeAnonymousType(m.Request.Body.AsString(), value);
        }
    }
}
