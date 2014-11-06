using System;
using Nancy;
using Nancy.Hosting.Self;
using SharpDrift.Utilities;

namespace SharpDrift
{
    class Program
    {
        public static void Main(string[] args)
        {
            using (var host = new NancyHost(new Uri("http://localhost")))
            {
                host.Start();
                Console.ReadLine();
            }
        }
    }
}
