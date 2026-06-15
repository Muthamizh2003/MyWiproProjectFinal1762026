package com.wipro.ecom.config;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.wipro.ecom.filter.JwtAuthFilter;

@Configuration
public class SecurityConfig {
	@Autowired
	UserDetailsService   userDetailsService;

	@Autowired
	JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

    	http
        .csrf(csrf -> csrf.disable())

        .sessionManagement(session ->
            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/users/register", "/users/login/authenticate",
                    "/login/**"
            		).permitAll()


		.requestMatchers(HttpMethod.GET, "/users/{id}")
		        .hasAnyRole("USER", "ADMIN")

		.requestMatchers(HttpMethod.PUT, "/users/{id}")
		        .hasAnyRole("USER", "ADMIN")

		// ADMIN ONLY
		.requestMatchers("/users/all").hasRole("ADMIN")
		.requestMatchers(HttpMethod.DELETE, "/users/**").hasRole("ADMIN")

        //PUBLIC
        .requestMatchers("/auth/**", "/users/register").permitAll()

        //USER + ADMIN
        .requestMatchers("/address/**").hasAnyRole("USER", "ADMIN")

        //ADMIN ONLY
        .requestMatchers("/admin/**").hasRole("ADMIN")

        .requestMatchers(HttpMethod.POST, "/products/**").hasRole("ADMIN")
		
		.requestMatchers(HttpMethod.PUT, "/products/**").hasRole("ADMIN")
		
		.requestMatchers(HttpMethod.DELETE, "/products/**").hasRole("ADMIN")

		.requestMatchers("/coupon/apply").hasRole("USER")
		.requestMatchers(HttpMethod.GET, "/coupon/**").hasRole("ADMIN")
		.requestMatchers(HttpMethod.POST, "/coupon").hasRole("ADMIN")
		.requestMatchers(HttpMethod.PUT, "/coupon/**").hasRole("ADMIN")
		.requestMatchers(HttpMethod.DELETE, "/coupon/**").hasRole("ADMIN")
		
		.requestMatchers("/delivery/agent/**").hasRole("DELIVERY")
		.requestMatchers(HttpMethod.GET, "/delivery/**").hasAnyRole("USER", "ADMIN", "DELIVERY")
		.requestMatchers("/delivery/start/**").hasAnyRole("USER", "ADMIN", "DELIVERY")
		
		.requestMatchers("/payment/**").hasRole("USER")
		
		.requestMatchers("/orders/**").hasRole("USER")
		
		.requestMatchers("/cart/**").hasRole("USER")
		
		.requestMatchers("/ai/**").hasRole("USER")
		
		.requestMatchers("/combo/**").hasRole("USER")
		
        .anyRequest().authenticated()

        )

        .authenticationProvider(getAuthProvider())
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
		
    	return http.build();
    }

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
	    return config.getAuthenticationManager();
	}

    @Bean
    public AuthenticationProvider getAuthProvider() {

    	DaoAuthenticationProvider dao =
    	        new DaoAuthenticationProvider(userDetailsService);

    	dao.setPasswordEncoder(passwordEncoder());

        return dao;
    }


    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}