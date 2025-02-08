using EcommerceBackend.Data;
using EcommerceBackend.Models;
using Microsoft.AspNetCore.Mvc;

namespace EcommerceBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly EcommerceDbContext _context;

        public CartController(EcommerceDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<CartItem>> GetCart()
        {
            return _context.CartItems.ToList();
        }

        [HttpPost]
        public ActionResult<CartItem> AddToCart(CartItem cartItem)
        {
            var product = _context.Products.Find(cartItem.ProductId);
            if (product == null) return NotFound("Product not found.");

            // Check if there is enough stock
            if (product.QuantityInStock < cartItem.Quantity)
            {
                return BadRequest($"Not enough stock. Only {product.QuantityInStock} items available.");
            }

            cartItem.Price = product.Price;
            cartItem.ProductName = product.Name;

            _context.CartItems.Add(cartItem);

            // Decrease the quantity in stock
            product.QuantityInStock -= cartItem.Quantity;

            _context.SaveChanges();

            return cartItem;
        }

        [HttpPut("update-quantity/{cartItemId}")]
        public IActionResult UpdateCartItemQuantity(int cartItemId, [FromQuery] int newQuantity)
        {
            // Get the cart item
            var cartItem = _context.CartItems.Find(cartItemId);
            if (cartItem == null) return NotFound("Cart item not found.");

            // Get the product associated with the cart item
            var product = _context.Products.Find(cartItem.ProductId);
            if (product == null) return NotFound("Product not found.");

            // Check if the new quantity is valid
            if (newQuantity <= 0)
            {
                return BadRequest("Quantity must be greater than zero.");
            }

            // Check if there's enough stock for the new quantity
            if (newQuantity > product.QuantityInStock + cartItem.Quantity) // Adding the existing quantity back
            {
                return BadRequest($"Not enough stock. Only {product.QuantityInStock + cartItem.Quantity} items available.");
            }

            // Update the cart item quantity
            product.QuantityInStock += cartItem.Quantity - newQuantity; // Adjust stock accordingly

            cartItem.Quantity = newQuantity;

            _context.SaveChanges();

            return Ok(cartItem);
        }

        [HttpDelete("{id}")]
        public IActionResult RemoveFromCart(int id)
        {
            var cartItem = _context.CartItems.Find(id);
            if (cartItem == null) return NotFound("Item not found in cart.");

            // Get the product associated with the cart item
            var product = _context.Products.Find(cartItem.ProductId);
            if (product == null) return NotFound("Product not found.");

            // Increase the product's stock quantity by the amount removed from the cart
            product.QuantityInStock += cartItem.Quantity;

            // Remove the item from the cart
            _context.CartItems.Remove(cartItem);
            _context.SaveChanges();

            return NoContent(); // Successfully removed the item from the cart
        }
    }
}
