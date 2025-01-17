package club.dnd5.portal.controller;

import javax.naming.directory.InvalidAttributesException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import club.dnd5.portal.dto.trait.TraitDto;
import club.dnd5.portal.model.AbilityType;
import club.dnd5.portal.model.SkillType;
import club.dnd5.portal.model.trait.Trait;
import club.dnd5.portal.repository.datatable.TraitDatatableRepository;

@Controller
public class TraitController {
	@Autowired
	private TraitDatatableRepository repository;

	@GetMapping("/traits")
	public String getTraits(Model model) {
		model.addAttribute("abilities", AbilityType.getBaseAbility());
		model.addAttribute("skills", SkillType.values());
		model.addAttribute("prerequisites", repository.findAllPrerequisite());
		model.addAttribute("metaTitle", "Черты");
		model.addAttribute("metaUrl", "https://dnd5.club/traits/");
		model.addAttribute("metaDescription", "Списко черт персонажей");
		return "traits";
	}
	
	@GetMapping("/traits/{name}")
	public String getTrait(Model model, @PathVariable String name) {
		model.addAttribute("abilities", AbilityType.getBaseAbility());
		model.addAttribute("skills", SkillType.values());
		model.addAttribute("prerequisites", repository.findAllPrerequisite());
		Trait trait = repository.findByEnglishName(name.replace("_", " "));
		model.addAttribute("selectedTrait", new TraitDto(trait));
		model.addAttribute("metaTitle", trait.getName());
		model.addAttribute("metaUrl", "https://dnd5.club/traits/" + name);
		model.addAttribute("metaDescription", String.format("%s (%s) - черта персонажа по D&D 5-редакции", trait.getName(), trait.getEnglishName()));
		return "traits";
	}
	
	@GetMapping("/traits/fragment/{id}")
	public String getTraitFragmentById(Model model, @PathVariable Integer id) throws InvalidAttributesException {
		model.addAttribute("trait", repository.findById(id).orElseThrow(InvalidAttributesException::new));
		return "fragments/trait :: view";
	}
}