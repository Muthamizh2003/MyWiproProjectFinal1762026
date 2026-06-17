package com.wipro.ecom.serviceimpl;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.wipro.ecom.dtos.UserDTO;
import com.wipro.ecom.entities.Role;
import com.wipro.ecom.entities.User;
import com.wipro.ecom.repository.RoleRepository;
import com.wipro.ecom.repository.UserRepository;
import com.wipro.ecom.services.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class UserServiceImpl implements UserService {

	private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

	@Autowired
    private UserRepository userRepo;
	
	@Autowired
    private RoleRepository roleRepo;
	
	@Autowired
	private PasswordEncoder passwordEncoder;

    //REGISTER USER
    @Override
    public UserDTO register(UserDTO dto) {
        log.info("Registering user with email: {}", dto.getEmail());

        if (userRepo.findByEmail(dto.getEmail()).isPresent()) {
            log.warn("Registration failed - email already exists: {}", dto.getEmail());
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(dto.getName());
        user.setUsername(dto.getEmail());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setMobile(dto.getMobile());
        //Assign default role (USER)
        Role role = roleRepo.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Role not found"));

        user.setRoles(Set.of(role));
        
        User saved = userRepo.save(user);

        log.info("User registered successfully: {}", saved.getEmail());
        return mapToDTO(saved);
    }

    //GET USER BY ID
    @Override
    public UserDTO getUserById(Long id) {

    	Long currentUserId = getLoggedInUserId(); 
    	boolean isAdmin = isCurrentUserAdmin(); 

    	if (!currentUserId.equals(id) && !isAdmin) {
    		log.warn("Access denied for user {} trying to access user {}", currentUserId, id);
    		throw new RuntimeException("Access denied");
    	}

        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        log.info("Retrieved user: {}", id);
        return mapToDTO(user);
    }

    //GET ALL USERS
    @Override
    public List<UserDTO> getAllUsers() {
        log.info("Fetching all users");
        return userRepo.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    //UPDATE USER
    @Override
    public UserDTO updateUser(Long id, UserDTO dto) {

    	Long currentUserId = getLoggedInUserId();
    	boolean isAdmin = isCurrentUserAdmin();

    	if (!currentUserId.equals(id) && !isAdmin) {
    		log.warn("Access denied for user {} trying to update user {}", currentUserId, id);
    		throw new RuntimeException("Access denied");
    	}

        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());

		if (dto.getMobile() != null) {
		    user.setMobile(dto.getMobile());
		}
		
		if (dto.getPassword() != null) {
		    user.setPassword(passwordEncoder.encode(dto.getPassword()));
		}

        User updated = userRepo.save(user);

        log.info("User updated: {}", id);
        return mapToDTO(updated);
    }

    //DELETE USER
    @Override
    public void deleteUser(Long id) {

    	Long currentUserId = getLoggedInUserId();
    	boolean isAdmin = isCurrentUserAdmin();
    	
    	if (!currentUserId.equals(id) && !isAdmin) {
    	    log.warn("Access denied for user {} trying to delete user {}", currentUserId, id);
    	    throw new RuntimeException("Access denied");
    	}

        if (!userRepo.existsById(id)) {
            throw new RuntimeException("User not found");
        }

        userRepo.deleteById(id);
        log.info("User deleted: {}", id);
    }

    //MAPPER METHOD
    private UserDTO mapToDTO(User user) {

        UserDTO dto = new UserDTO();

        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setMobile(user.getMobile());
        //Converting roles → String
        dto.setRoles(
                user.getRoles()
                        .stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet())
        );

        return dto;
    }
    
    public UserDTO login(String email, String password) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid credentials");
        }

        return mapToDTO(user);
    }
    
    private Long getLoggedInUserId() {
        String username = SecurityContextHolder.getContext()
            .getAuthentication().getName();

        User user = userRepo.findByEmail(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getId();
    }
    
    private boolean isCurrentUserAdmin() {
        return SecurityContextHolder.getContext()
            .getAuthentication()
            .getAuthorities()
            .stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
}