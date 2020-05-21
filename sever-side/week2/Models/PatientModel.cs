using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using week2.Data.Entities;

namespace week2.Models
{
    public class PatientModel
    {
        public int PatientId { get; set; }
        public List<PathModel> Paths { get; set; }
    }
}
