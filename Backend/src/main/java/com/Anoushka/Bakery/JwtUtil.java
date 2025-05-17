package com.Anoushka.Bakery;

import java.nio.charset.StandardCharsets;
import java.sql.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.Anoushka.Bakery.Models.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
	
	@Value("${jwt.token.secret}")
	private String SECRET_KEY;

	
	private SecretKey getSigningKey() {
	    return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
	}

	
	public String generatetoken(User user) {
		
		Map<String,Object> claims = new HashMap<>();
		claims.put("role", user.getRole());
		claims.put("name", user.getName());
		claims.put("email", user.getEmail());
		return Jwts.builder()
				.claims(claims)
				.subject(user.getUsername())
				.issuedAt(new Date(System.currentTimeMillis()))
				.expiration(new Date(System.currentTimeMillis()+ 1000*60*60))
				.signWith(getSigningKey(), Jwts.SIG.HS256)
				.compact();
				
	}
	  public String extractUsername(String token) {
	        return getClaims(token).getSubject();
	    }
	  
	  public String extractName(String token) {
		    return getClaims(token).get("name", String.class);
		}

	  
	  public String extractRole(String token) {
	      return getClaims(token).get("role", String.class);  // Get the "role" claim from the token
	  }


	    public boolean isTokenValid(String token, String username) {
	        return extractUsername(token).equals(username) && !isTokenExpired(token);
	    }

	    private boolean isTokenExpired(String token) {
	        return getClaims(token).getExpiration().before(new Date(0));
	    }

	    private Claims getClaims(String token) {
	        return Jwts.parser()
	        		.verifyWith(getSigningKey())
	        		.build()
	        		.parseSignedClaims(token)
	        		.getPayload();
	        
	    }
	    
	    public String extractEmail(String token) {
	        return getClaims(token).get("email", String.class);
	    }

	    
	    

}
