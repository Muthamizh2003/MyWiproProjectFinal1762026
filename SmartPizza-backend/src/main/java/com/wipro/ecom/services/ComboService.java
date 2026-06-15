package com.wipro.ecom.services;

import java.util.List;

import com.wipro.ecom.dtos.ComboDTO;
import com.wipro.ecom.dtos.ComboRequestDTO;

public interface ComboService {

	List<ComboDTO> getSmartCombos(ComboRequestDTO request);
}