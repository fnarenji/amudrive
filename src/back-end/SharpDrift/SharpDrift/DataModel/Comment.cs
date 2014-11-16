namespace SharpDrift.DataModel
{
    public class Comment
    {
        public int IdCarPooling { get; set; }
        public int IdClient { get; set; }
        public int IdComment { get; set; }
        public string Message { get; set; }
        public int PoolingMark { get; set; }
        public int DriverMark { get; set; }

    }
}