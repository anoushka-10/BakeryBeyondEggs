package com.Anoushka.Bakery.Services;

import java.util.Iterator;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Anoushka.Bakery.Models.Cart;
import com.Anoushka.Bakery.Models.CartItem;
import com.Anoushka.Bakery.Models.Item;
import com.Anoushka.Bakery.Models.User;
import com.Anoushka.Bakery.Models.WeightPrice;
import com.Anoushka.Bakery.Repositories.CartItemRepository;
import com.Anoushka.Bakery.Repositories.CartRepository;
import com.Anoushka.Bakery.Repositories.ItemRepository;
import com.Anoushka.Bakery.Repositories.UserRepository;
import com.Anoushka.Bakery.Repositories.weightpriceRepo;

import jakarta.transaction.Transactional;

@Service
public class CartService {
    
    @Autowired
    private CartRepository cartRepo;

    @Autowired
    private CartItemRepository cartItemRepo;

    @Autowired
    private UserRepository userRepo;
    
    @Autowired
    private ItemRepository itemrepo;
    
    @Autowired
    private weightpriceRepo wtpricerepo;

    public Cart getCartByUser(User user) {
        return cartRepo.findByUser(user).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepo.save(newCart);
        });
    }
    public Cart removeItemFromCart(User user, int itemid){
    	Cart cart=getCartByUser(user);
        Iterator<CartItem> iterator = cart.getItems().iterator();
        while (iterator.hasNext()) {
            CartItem ci = iterator.next();
            if (ci.getItem().getId() == itemid) {
                iterator.remove(); // removes from the list
                break; // if only one such item exists
            }
        }
    	return cartRepo.save(cart);
    }

    public Cart addItemToCart(User user, int itemid, int weightPriceId, int quantity) {
        Cart cart = getCartByUser(user);

        Optional<Item> itemOpt = itemrepo.findById(itemid);
        Optional<WeightPrice> wtPriceOpt = wtpricerepo.findById(weightPriceId);

        if (itemOpt.isEmpty() || wtPriceOpt.isEmpty()) {
            throw new IllegalArgumentException("Invalid item ID or weightPrice ID");
        }

        Item item = itemOpt.get();
        WeightPrice wtPrice = wtPriceOpt.get();

        // Check if this item already exists in the cart
        CartItem existingItem = null;
        for (CartItem ci : cart.getItems()) {
            if (ci.getItem().getId() == itemid && ci.getWeightPrice().getId() == weightPriceId) {
                existingItem = ci;
                break;
            }
        }

        if (existingItem != null) {
            // If item exists, just update the quantity
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
        } else {
            // If item does not exist, create new CartItem
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setItem(item);
            newItem.setWeightPrice(wtPrice);
            newItem.setQuantity(quantity);

            cart.getItems().add(newItem);
        }

        return cartRepo.save(cart);
    }

	public void clearCart(User user) {
		Cart cart = getCartByUser(user);
		cartRepo.delete(cart);
		
	}
	
//	@Transactional
//	public void removeItemFromCartByEmail(String email, int cartItemId) {
//	    // Validate input
//	    if (email == null || email.trim().isEmpty()) {
//	        throw new RuntimeException("Email cannot be null or empty");
//	    }
//	    
//	    if (cartItemId <= 0) {
//	        throw new RuntimeException("Invalid cart item ID: " + cartItemId);
//	    }
//
//	    User user = userRepo.findByEmail(email)
//	        .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
//
//	    Cart cart = cartRepo.findByUser(user)
//	        .orElseThrow(() -> new RuntimeException("Cart not found for user: " + email));
//
//	    // First, let's check if the cart item exists in database at all
//	    Optional<CartItem> cartItemFromDb = cartItemRepo.findById(cartItemId);
//	    if (cartItemFromDb.isEmpty()) {
//	        throw new RuntimeException("Cart item with ID " + cartItemId + " does not exist in database");
//	    }
//	    
//	    // Check if this cart item belongs to this user's cart
//	    CartItem cartItem = cartItemFromDb.get();
//	    if (cartItem.getCart().getId() != cart.getId()) {
//	        throw new RuntimeException("Cart item " + cartItemId + " does not belong to user " + email);
//	    }
//
//	    // Now remove from collection and delete
//	    cart.getItems().removeIf(item -> item.getId() == cartItemId);
//	    cartItemRepo.deleteById(cartItemId);
//	    
//	    // Save cart to update any other changes
//	    cartRepo.save(cart);
//	}

	// Alternative method using direct database query (recommended)
	@Transactional
	public void removeItemFromCart(String email, int cartItemId) {
	    // Just delete the cart item directly with a safety check
	    int deletedRows = cartItemRepo.deleteCartItemSafely(cartItemId, email);
	    
	    if (deletedRows == 0) {
	        throw new RuntimeException("Cart item not found or doesn't belong to user");
	    }
	}
}
