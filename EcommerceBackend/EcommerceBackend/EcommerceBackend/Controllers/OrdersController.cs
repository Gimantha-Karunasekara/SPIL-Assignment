using EcommerceBackend.Data;
using EcommerceBackend.Models;
using Microsoft.AspNetCore.Mvc;

namespace EcommerceBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly EcommerceDbContext _context;

        public OrdersController(EcommerceDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public ActionResult<Order> PlaceOrder()
        {
            var cartItems = _context.CartItems.ToList();
            if (!cartItems.Any()) return BadRequest("Cart is empty.");

            var order = new Order
            {
                OrderDate = DateTime.UtcNow,
                Items = cartItems,
                TotalPrice = cartItems.Sum(item => item.Price * item.Quantity)
            };

            // Update the inventory for each product in the cart
            foreach (var cartItem in cartItems)
            {
                var product = _context.Products.Find(cartItem.ProductId);
                if (product != null)
                {
                    //product.QuantityInStock -= cartItem.Quantity;
                }
            }

            _context.Orders.Add(order);
            _context.CartItems.RemoveRange(cartItems); // Clear the cart after order
            _context.SaveChanges();

            return order;
        }
    }
}
