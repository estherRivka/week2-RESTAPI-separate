using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using week2.Data.Entities;

namespace week2.Data
{
    public static class DataFormat
    {
        private readonly static List<Patient> patients = new List<Patient>() {
            new Patient() { Id = 1, Paths = new List<Path>() {
                new Path(){ City = "Jerusalem", StartDate = new DateTime(2019, 12, 08), EndDate = new DateTime(2019, 12, 09), Location = "Library" },
                new Path() { City = "Jafa", StartDate = new DateTime(2019, 10, 10), EndDate = new DateTime(2019, 10, 11), Location = "Library" },
                new Path() { City = "Tzfat", StartDate = new DateTime(2018, 03, 02), EndDate = new DateTime(2018, 03, 05), Location = "Library" }
                },

            },
            new Patient() { Id = 2, Paths = new List<Path>() {
                new Path() { City = "Tel Aviv", StartDate = new DateTime(2018, 12, 08), EndDate = new DateTime(2018, 12, 01), Location = "Library" },
                new Path() { City = "Tiberias", StartDate = new DateTime(2020, 10, 12), EndDate = new DateTime(2020, 10, 11), Location = "Library" }

                }
            }

        };

        public static List<Path> GetAllPaths()
        {
            List<Path> paths = new List<Path>();
            patients.ForEach(patient =>
            {
                paths.AddRange(patient.Paths);
            });
            return paths;
        }

        public static Patient AddPatient(Patient newPatient)
        {
            patients.Add(newPatient);
            return newPatient;
        }

        public static Patient UpdatePatient(Patient newPatient)
        {
            List<Path> paths = new List<Path>();
            Patient patient = new Patient();
            patients.ForEach(p =>
            {
                if (p.Id == newPatient.Id)
                {
                    p.Paths = newPatient.Paths;
                    patient = p;
                }

            });
            return patient;

        }
        public static List<Path> GetPathsById(int id)
        {
            List<Path> paths = new List<Path>();
            Patient patient = new Patient();
            // Patient List<patient> =   patients.Where(p => p.Id = id);
            patients.ForEach(p =>
            {
                if (p.Id == id)
                    paths = p.Paths;
            });

            if (!paths.Any())
                return null;

            //paths.AddRange(patient.Paths);
            return paths;
        }
        public static Patient GetPatientById(int id)
        {
            return patients.Find(p => p.Id == id);

        }
        //public static List<Path> SetPathsById(int id)
        //{
        //    List<Path> paths = new List<Path>();
        //    Patient patient = patients.Where(p =>
        //    {
        //        p.Id = id;
        //    });
        //    if (patient == null)
        //        return null;
        //    paths.AddRange(patient.Paths);
        //    return paths;
        //}
    }
}
