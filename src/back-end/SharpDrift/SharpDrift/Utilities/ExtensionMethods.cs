using System;
using Nancy;
using Nancy.Responses;
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
    }
}
