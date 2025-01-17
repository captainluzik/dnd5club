package club.dnd5.portal.repository.datatable;

import org.springframework.data.jpa.datatables.repository.DataTablesRepository;
import org.springframework.stereotype.Repository;

import club.dnd5.portal.model.background.Background;

@Repository
public interface BackgroundDatatableRepository extends DataTablesRepository<Background, Integer> {
	Background findByEnglishName(String name);
}