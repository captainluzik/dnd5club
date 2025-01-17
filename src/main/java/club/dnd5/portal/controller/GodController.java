package club.dnd5.portal.controller;

import javax.naming.directory.InvalidAttributesException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import club.dnd5.portal.dto.GodDto;
import club.dnd5.portal.model.Alignment;
import club.dnd5.portal.model.god.Domain;
import club.dnd5.portal.model.god.God;
import club.dnd5.portal.model.god.Rank;
import club.dnd5.portal.repository.datatable.GodDatatableRepository;
import club.dnd5.portal.repository.datatable.PantheonGodRepository;

@Controller
public class GodController {
	@Autowired
	private GodDatatableRepository repository;

	@Autowired
	private PantheonGodRepository pantheonRepo;

	@GetMapping("/gods")
	public String getGods(Model model) {
		model.addAttribute("alignments", Alignment.getGods());
		model.addAttribute("domains", Domain.values());
		model.addAttribute("ranks", Rank.values());
		model.addAttribute("pantheons", pantheonRepo.findAll());
		model.addAttribute("metaTitle", "Боги");
		model.addAttribute("metaUrl", "https://dnd5.club/items/magic");
		model.addAttribute("metaDescription", "Боги, полубоги и философии D&D 5 редакции");
		return "gods";
	}
	
	@GetMapping("/gods/{name}")
	public String getGod(Model model, @PathVariable String name) {
		model.addAttribute("alignments", Alignment.getGods());
		model.addAttribute("domains", Domain.values());
		model.addAttribute("ranks", Rank.values());
		model.addAttribute("pantheons", pantheonRepo.findAll());
		God god = repository.findByEnglishName(name.replace("_", " "));
		model.addAttribute("selectedGod", new GodDto(god));
		model.addAttribute("metaTitle", god.getName());
		model.addAttribute("metaUrl", "https://dnd5.club/items/magic" + name);
		model.addAttribute("metaDescription", String.format("%s (%s) - %s %s, %s", god.getName(), god.getEnglishName(), god.getAligment().getCyrilicName(), god.getSex().getCyrilicName(), god.getCommitment()));
		return "gods";
	}
	
	@GetMapping("/gods/fragment/{id}")
	public String getGodFragmentById(Model model, @PathVariable Integer id) throws InvalidAttributesException {
		model.addAttribute("god", repository.findById(id).orElseThrow(InvalidAttributesException::new));
		return "fragments/god :: view";
	}
}