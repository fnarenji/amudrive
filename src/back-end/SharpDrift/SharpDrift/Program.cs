using System;
using Nancy.Hosting.Self;

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
