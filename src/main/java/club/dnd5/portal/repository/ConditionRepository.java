package club.dnd5.portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import club.dnd5.portal.model.Condition;

@Repository
public interface ConditionRepository extends JpaRepository<Condition, Integer>{
	Condition findOneByEnglishName(String name);
}