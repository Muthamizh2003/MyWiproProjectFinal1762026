package com.wipro.ecom.serviceimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.wipro.ecom.dtos.AddressDTO;
import com.wipro.ecom.entities.Address;
import com.wipro.ecom.entities.User;
import com.wipro.ecom.external.AzureMapsService;
import com.wipro.ecom.repository.AddressRepository;
import com.wipro.ecom.repository.UserRepository;
import com.wipro.ecom.services.AddressService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class AddressServiceImpl implements AddressService {

	private static final Logger log = LoggerFactory.getLogger(AddressServiceImpl.class);

	@Autowired
    private AddressRepository addressRepo;
	
	@Autowired
    private UserRepository userRepo;
	
	@Autowired
	private AzureMapsService mapsService;

    //ADD ADDRESS
    @Override
    public AddressDTO addAddress(Long userId, AddressDTO dto) {
        log.info("Adding address for user: {}", userId);
    	
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long currentUserId = getLoggedInUserId();
        boolean isAdmin = isCurrentUserAdmin();

        if (!currentUserId.equals(userId) && !isAdmin) {
            log.warn("Access denied for user {} trying to add address for user {}", currentUserId, userId);
        	throw new RuntimeException("Access denied");
        }

        Address address = new Address();
        address.setStreet(dto.getStreet());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setPincode(dto.getPincode());
        address.setLandmark(dto.getLandmark());
        address.setUser(user);

	     //Create full address string
	     String fullAddress = dto.getStreet() + ", " + dto.getCity() + ", " + dto.getState();
	
	     //Call Azure Maps
	     double[] coords = mapsService.getCoordinates(fullAddress);
	
	     //Set lat/lng
	     address.setLatitude(coords[0]);
	     address.setLongitude(coords[1]);
	
	     return mapToDTO(addressRepo.save(address));
    }

    //GET ALL ADDRESSES FOR USER
    @Override
    public List<AddressDTO> getUserAddresses(Long userId) {
        log.info("Fetching addresses for user: {}", userId);
    	Long currentUserId = getLoggedInUserId();
        boolean isAdmin = isCurrentUserAdmin();

        if (!currentUserId.equals(userId) && !isAdmin) {
            log.warn("Access denied for user {} trying to get addresses for user {}", currentUserId, userId);
        	throw new RuntimeException("Access denied");
        }
        return addressRepo.findByUserId(userId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    //GET ADDRESS BY ID
    @Override
    public AddressDTO getAddressById(Long id) {
        log.info("Fetching address by id: {}", id);

    	Address address = addressRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Address not found"));

	    Long currentUserId = getLoggedInUserId();
	    boolean isAdmin = isCurrentUserAdmin();
	
	    Long ownerId = address.getUser().getId(); 
	
	    if (!currentUserId.equals(ownerId) && !isAdmin) {
	        log.warn("Access denied for user {} trying to access address {}", currentUserId, id);
	        throw new RuntimeException("Access denied");
	    }


        return mapToDTO(address);
    }

    //UPDATE ADDRESS
    @Override
    public AddressDTO updateAddress(Long id, AddressDTO dto) {
        log.info("Updating address: {}", id);

    	Long currentUserId = getLoggedInUserId();
	    boolean isAdmin = isCurrentUserAdmin();

        Address address = addressRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        Long ownerId = address.getUser().getId();

	    if (!currentUserId.equals(ownerId) && !isAdmin) {
	        log.warn("Access denied for user {} trying to update address {}", currentUserId, id);
	        throw new RuntimeException("Access denied");
	    }

        address.setStreet(dto.getStreet());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setPincode(dto.getPincode());
        address.setLandmark(dto.getLandmark());

		String fullAddress = dto.getStreet() + ", " + dto.getCity() + ", " + dto.getState();
		
		double[] coords = mapsService.getCoordinates(fullAddress);
		
		address.setLatitude(coords[0]);
		address.setLongitude(coords[1]);

        return mapToDTO(addressRepo.save(address));
    }

    //DELETE ADDRESS
    @Override
    public void deleteAddress(Long id) {
        log.info("Deleting address: {}", id);
    	
    	Long currentUserId = getLoggedInUserId();
	    boolean isAdmin = isCurrentUserAdmin();

	    Address address = addressRepo.findById(id)
	            .orElseThrow(() -> new RuntimeException("Address not found"));
	
	    Long ownerId = address.getUser().getId(); 
	
	    if (!currentUserId.equals(ownerId) && !isAdmin) {
	        log.warn("Access denied for user {} trying to delete address {}", currentUserId, id);
	        throw new RuntimeException("Access denied");
	    }

        addressRepo.deleteById(id);
    }

    //MAPPER METHOD
    private AddressDTO mapToDTO(Address a) {

        AddressDTO dto = new AddressDTO();

        dto.setId(a.getId());
        dto.setStreet(a.getStreet());
        dto.setCity(a.getCity());
        dto.setState(a.getState());
        dto.setPincode(a.getPincode());
        dto.setLandmark(a.getLandmark());
        dto.setLatitude(a.getLatitude());
        dto.setLongitude(a.getLongitude());
        return dto;
    }
    
    private boolean isCurrentUserAdmin() {
        return SecurityContextHolder.getContext()
            .getAuthentication()
            .getAuthorities()
            .stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
    
    private Long getLoggedInUserId() {
        String username = SecurityContextHolder.getContext()
            .getAuthentication().getName();

        User user = userRepo.findByEmail(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getId();
    }
    
}