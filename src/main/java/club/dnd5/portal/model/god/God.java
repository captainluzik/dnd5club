package club.dnd5.portal.model.god;

import java.util.List;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import club.dnd5.portal.model.Alignment;
import club.dnd5.portal.model.book.Book;
import club.dnd5.portal.util.HtmlConverter;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString

@Entity
@Table(name = "gods")
public class God {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private String name;
	private String englishName;
	private String commitment;
	
	@Enumerated(EnumType.STRING)
	private GodSex sex;
	
	@Enumerated(EnumType.STRING)
	private Rank rank;
	
	@Enumerated(EnumType.STRING)
	private Alignment aligment;
	
	@Column(columnDefinition = "TEXT")
	private String description;
	private String symbol;
	private String nicknames;
	
	@ElementCollection(targetClass=Domain.class)
    @CollectionTable(name="god_domains")
	@Enumerated(EnumType.STRING)
	private List<Domain> domains;
	
	@ManyToOne
	@JoinColumn(name = "pantheon_id")
	private Pantheon pantheon;
	
	@ManyToOne
	@JoinColumn(name = "source")
	private Book book;
	private Short page;
	
	@Column(columnDefinition = "integer default 1")
	private int version = 1;

	public String getPrefixName() {
		return rank == null ? sex.getCyrilicName() : rank.getName(sex) + " " + sex.getCyrilicName();
	}
	
	public String getDescription() {
		return HtmlConverter.toHtml(description);
	}
}