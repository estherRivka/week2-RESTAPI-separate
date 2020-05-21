using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using week2.Data;
using week2.Data.Entities;
using week2.Models;

namespace week2.Controllers
{
    //[EnableCors]
    [Route("[controller]")]
    [ApiController]
    public class PathController : ControllerBase
    {
        private readonly IMapper _mapper;
        public PathController(IMapper mapper)
        {
            _mapper = mapper;
          
        }

        [EnableCors]
        [HttpGet]

        public ActionResult<List<PathModel>> Get()
        {

            try
            {
                List<Path> paths = DataFormat.GetAllPaths();
                if (paths == null) return NotFound("Couldn't find any paths");
                // if (!paths.Any()) return BadRequest("Couldn't find any paths");
                return _mapper.Map<List<PathModel>>(paths);
            }
            catch (Exception)
            {

                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to get Paths");
            }
        }


        [HttpGet("{city}")]
        public ActionResult<List<PathModel>> Get(string city)
        {
            try
            {
                List<Path> paths = DataFormat.GetAllPaths();
                if (paths == null || !paths.Any())
                    return NotFound("Couldn't find any paths");
                List<Path> PathsInCity = paths.FindAll(path => path.City == city);
                // if (sortedPath != null && !sortedPath.Any())
                // return NotFound($"Couldn't find any paths in city {city}");
                return _mapper.Map<List<PathModel>>(PathsInCity);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to get Paths");
            }
        }





        //// GET: api/Path
        //[HttpGet]
        //public IEnumerable<string> Get()
        //{
        //    return new string[] { "value1", "value2" };
        //}

        //// GET: api/Path/5
        //[HttpGet("{id}", Name = "Get")]
        //public string Get(int id)
        //{
        //    return "value";
        //}

        //// POST: api/Path
        //[HttpPost]
        //public void Post([FromBody] string value)
        //{
        //}

        //// PUT: api/Path/5
        //[HttpPut("{id}")]
        //public void Put(int id, [FromBody] string value)
        //{
        //}

        //// DELETE: api/ApiWithActions/5
        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}
    }
}
