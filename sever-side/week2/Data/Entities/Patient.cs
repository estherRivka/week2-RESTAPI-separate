using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace week2.Data.Entities
{
    public class Patient
    {
        public int Id { get; set; }
        public string Moniker { get; set; }
        public List<Path> Paths { get; set; }
    }
}
