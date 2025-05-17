package com.Anoushka.Bakery.Services;

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

    public Cart addItemToCart(User user, int itemid, int weightPriceId, int quantity) {
        Cart cart = getCartByUser(user);

        CartItem cartItem = new CartItem();
        cartItem.setCart(cart);
        Optional<Item> itemopt=itemrepo.findById(itemid);
        if(itemopt.isPresent()) {
        	Item item= itemopt.get();
        	cartItem.setItem(item);
        }
        Optional<WeightPrice> wtpriceopt=wtpricerepo.findById(weightPriceId);
        if(wtpriceopt.isPresent()) {
        	WeightPrice wtprice= wtpriceopt.get();
        	cartItem.setWeightPrice(wtprice);
        }
       
       
        cartItem.setQuantity(quantity);

        cart.getItems().add(cartItem);
        return cartRepo.save(cart);
    }

    public void clearCart(User user) {
        Cart cart = getCartByUser(user);
        cart.getItems().clear();
        cartRepo.save(cart);
    }

   
}
