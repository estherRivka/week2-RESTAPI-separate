using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using week2.Data.Entities;
using week2.Models;

namespace week2.Controllers
{

    [Route("[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly static List<Patient> patients = new List<Patient>() {
            new Patient() { Id = 1, Paths = new List<Path>() {
                new Path(){ City = "Jerusalem", StartDate = new DateTime(2019, 12, 20), EndDate = new DateTime(2019, 12, 25), Location = "Library" },
                new Path() { City = "Jafa", StartDate = new DateTime(2019, 10, 10), EndDate = new DateTime(2019, 10, 11), Location = "Library" },
                new Path() { City = "Tzfat", StartDate = new DateTime(2018, 3, 2), EndDate = new DateTime(2018, 3, 5), Location = "Library" }
                }
            },
            new Patient() { Id = 2, Paths = new List<Path>() {
                new Path() { City = "Tel Aviv", StartDate = new DateTime(2018, 12, 20), EndDate = new DateTime(2018, 12, 26), Location = "Library" },
                new Path() { City = "Tiberias", StartDate = new DateTime(2020, 10, 23), EndDate = new DateTime(2020, 10, 24), Location = "Library" }

                }
            }

        };
       

        private readonly IMapper _mapper;
        private readonly LinkGenerator _linkGenerator;
        public PatientController(IMapper mapper, LinkGenerator linkGenerator)
        {
            _mapper = mapper;
            _linkGenerator = linkGenerator;
        }



        [EnableCors]
        // GET: api/Path/5
        [HttpGet("{id:int}")]
        public ActionResult<PatientModel> Get(int id)
        {
            try
            {
                Patient patient = patients
                    .Find(patient => patient.Id == id);

                if (patient == null)
                {
                    return NotFound($"patient with id:{id} was not found");
                }
               return _mapper.Map<PatientModel>(patient);
            }
            catch (Exception e)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Database Failure while retrieving patient");
            }

        }

        // POST: api/Path
        [HttpPost]
        public ActionResult<PatientModel> Post( PatientModel newPatient)
        {
            try
            {
                bool exists = patients
                    .Exists(patient => patient.Id == newPatient.PatientId);
                if (exists == true)
                {
                    return BadRequest($"patient with id:{newPatient.PatientId} already exists");
                }

                var newPatientURI = _linkGenerator.GetPathByAction(HttpContext,
                  "Get",
                  values: new { id = newPatient.PatientId });

                if (string.IsNullOrWhiteSpace(newPatientURI))
                {
                    return BadRequest("Could not use current patientId");
                }

                // Create a new Camp
                Patient patient = _mapper.Map<Patient>(newPatient);
                patients.Add(patient);
              
                    return Created(newPatientURI, _mapper.Map<PatientModel>(patient));
                

            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Database Failure while creating new patient");
            }

        }
    

        // PUT: api/Path/5
        [HttpPut]
        public ActionResult<PatientModel> Put( PatientModel updatedPatient)
        {
            try
            {
                Patient patientToUpdate = patients
                    .Find(patient => patient.Id == updatedPatient.PatientId);

                DateTime x = DateTime.ParseExact(updatedPatient.Paths[0].StartDate, "dd/mm/yyyy", null);
                if (patientToUpdate == null)
                {
                    return NotFound($"patient with id:{updatedPatient.PatientId} was not found");
                }
                _mapper.Map(updatedPatient, patientToUpdate);
                return _mapper.Map<PatientModel>(patientToUpdate);
            }
            catch (Exception e)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, "Database Failure while retrieving patient");
            }
 
             
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id:int}")]
        public ActionResult Delete(int id)
        {
            try
            {
                Patient patient = patients.Find(patient => patient.Id == id);
                if (patient == null)
                {
                    return BadRequest($"patient with id:{id} does not exist");
                }

                patients.Remove(patient);
                return Ok();
            }
            catch (Exception)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, "Database Failure while deleting patient");
            }
           
        }

    }
}
