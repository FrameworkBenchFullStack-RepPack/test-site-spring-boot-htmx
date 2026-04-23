package com.benchmark.test_site_spring_boot_htmx.web.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.benchmark.test_site_spring_boot_htmx.web.models.Person;

@Repository
public interface IPersonRepository extends JpaRepository<Person, Integer> {
        @EntityGraph(attributePaths = { "category" })
        @Query("SELECT p FROM Person p WHERE " +
                        "(:categories IS NULL OR p.category.id IN :categories) AND " +
                        "(p.age >= :ageFrom) AND " +
                        "(p.age <= :ageTo)")
        Page<Person> findByFilters(
                        @Param("categories") List<Integer> categories,
                        @Param("ageFrom") Integer ageFrom,
                        @Param("ageTo") Integer ageTo,
                        Pageable pageable);
}