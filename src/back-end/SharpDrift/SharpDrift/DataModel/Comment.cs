using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharpDrift.DataModel
{
    public class Comment
    {
        public int IdCarPooling { get; set; }
        public int IdClient { get; set; }
        public int IdComment { get; set; }
        public string Message { get; set; }

    }
}
