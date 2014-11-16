using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharpDrift.DataModel
{
    public class CarPoolingJoin
    {
        public int IdClient { get; set; }
        public int IdCarPooling { get; set; }
        public bool Accepted { get; set; }
    }
}
