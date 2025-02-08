using EcommerceBackend.Data;
using EcommerceBackend.Models;
using Microsoft.AspNetCore.Mvc;

namespace EcommerceBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly EcommerceDbContext _context;

        public ProductsController(EcommerceDbContext context)
        {
            _context = context;

            // Seed products if the database is empty
            if (!_context.Products.Any())
            {
                _context.Products.AddRange(new[]
                {
                    new Product { Name = "Laptop", Price = 1000, Description = "High performance laptop", QuantityInStock = 50 },
                    new Product { Name = "Smartphone", Price = 500, Description = "Latest model smartphone", QuantityInStock = 100 },
                    new Product { Name = "Headphones", Price = 50, Description = "Wireless headphones", QuantityInStock = 200 }
                });
                _context.SaveChanges();
            }
        }

        [HttpGet]
        public ActionResult<IEnumerable<Product>> GetProducts()
        {
            return _context.Products.ToList();
        }

        [HttpGet("{id}")]
        public IActionResult GetProduct(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null)
            {
                return NotFound("Product not found.");
            }
            return Ok(product);
        }

        [HttpPost]
        public IActionResult AddProduct([FromBody] Product newProduct)
        {
            if (newProduct == null)
            {
                return BadRequest("Product details are required.");
            }

            if (newProduct.QuantityInStock < 0)
            {
                return BadRequest("Quantity in stock cannot be negative.");
            }

            if (string.IsNullOrEmpty(newProduct.Name) || string.IsNullOrEmpty(newProduct.Description) || newProduct.Price <= 0)
            {
                return BadRequest("Invalid product details. Ensure all fields are filled correctly.");
            }

            // Add the new product to the database
            _context.Products.Add(newProduct);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetProduct), new { id = newProduct.Id }, newProduct);
        }

        [HttpPut("{id}")]
        public IActionResult EditProduct(int id, [FromBody] Product updatedProduct)
        {
            var product = _context.Products.Find(id);
            if (product == null)
            {
                return NotFound("Product not found.");
            }

            // Update the product details
            product.Name = updatedProduct.Name;
            product.Description = updatedProduct.Description;
            product.Price = updatedProduct.Price;
            product.QuantityInStock = updatedProduct.QuantityInStock;

            _context.SaveChanges();

            return Ok(product);
        }

        [HttpPatch("add-stock/{id}")]
        public IActionResult AddStock(int id, [FromQuery] int quantityToAdd)
        {
            var product = _context.Products.Find(id);
            if (product == null)
            {
                return NotFound("Product not found.");
            }

            if (quantityToAdd <= 0)
            {
                return BadRequest("Quantity to add must be greater than zero.");
            }

            // Increase the stock by the specified quantity
            product.QuantityInStock += quantityToAdd;

            _context.SaveChanges();

            return Ok(product);
        }
    }
}
