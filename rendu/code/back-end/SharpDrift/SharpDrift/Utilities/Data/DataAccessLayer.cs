using System.Data.Common;
using Insight.Database;
using Npgsql;

namespace SharpDrift.Utilities.Data
{
    internal static class DAL
    {
        private static readonly NpgsqlConnectionStringBuilder ConnectionBuilder
            =
            new NpgsqlConnectionStringBuilder(
                "Server=127.0.0.1;Port=5432;Database=amudrive;User Id=postgres;Password=lol;Pooling=true;MinPoolSize=1;MaxPoolSize=20;ConnectionLifeTime=15");

        public static DbConnection Conn
        {
            get { return ConnectionBuilder.Connection(); }
        }
    }
}