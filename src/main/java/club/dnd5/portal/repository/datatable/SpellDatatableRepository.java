package club.dnd5.portal.repository.datatable;

import java.util.List;

import org.springframework.data.jpa.datatables.repository.DataTablesRepository;
import org.springframework.stereotype.Repository;

import club.dnd5.portal.model.book.TypeBook;
import club.dnd5.portal.model.splells.Spell;

@Repository
public interface SpellDatatableRepository extends DataTablesRepository<Spell, Integer> {
	Spell findByEnglishName(String name);

	List<Spell> findByLevelAndBook_type(byte level, TypeBook type);
}