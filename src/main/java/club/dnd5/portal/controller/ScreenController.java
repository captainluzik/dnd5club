package club.dnd5.portal.controller;

import javax.naming.directory.InvalidAttributesException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mobile.device.Device;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import club.dnd5.portal.model.screen.Screen;
import club.dnd5.portal.repository.datatable.ScreenDatatableRepository;


@Controller
public class ScreenController {
	@Autowired
	private ScreenDatatableRepository repository;

	@GetMapping("/screens")
	public String getScreens(Model model) {
		model.addAttribute("screens", repository.findAllByParent(null));
		return "screens";
	}
	
	@GetMapping("/screens/{name}")
	public String getScreen(Model model, @PathVariable String name) {
		model.addAttribute("selectedScreen", name);
		model.addAttribute("screens", repository.findAllByParent(null));
		return "screens";
	}
	
	@GetMapping("/screens/{name}/{subscreen}")
	public String getSubscreenList(Model model, @PathVariable String name, @PathVariable String subscreen) {
		model.addAttribute("screens", repository.findAllByParent(null));
		model.addAttribute("selectedScreen", name);
		model.addAttribute("selectedSubscreen", subscreen);
		return "screens";
	}
	
	@GetMapping("/screens/fragment/{name}")
	public String getScreenFragmentById(Model model, @PathVariable String name) throws InvalidAttributesException {
		model.addAttribute("screen", repository.findByEnglishName(name.replace("_", " ")).orElseThrow(InvalidAttributesException::new));
		return "fragments/screen :: view";
	}
	
	@GetMapping("/screens/{englishName}/subscreens/list")
	public String getSubscreenList(Model model, Device device, @PathVariable String englishName) {
		model.addAttribute("device", device);
		Screen screen = repository.findByEnglishName(englishName.replace("_", " ")).orElseThrow(IllegalArgumentException::new);
		model.addAttribute("subscreens", screen.getChields());
		return "fragments/subscreens_list :: sub_menu"; 
	}
	
	@GetMapping("/screens/{screenName}/subscreen/{subscreenName}")
	public String getFragmentSubraces(Model model, Device device, @PathVariable String screenName, @PathVariable String subscreenName) {
		Screen screen = repository.findByEnglishName(subscreenName.replace("_", " ")).orElseThrow(IllegalArgumentException::new);
		model.addAttribute("screen", screen);
		return "fragments/screen :: view";
	}
}