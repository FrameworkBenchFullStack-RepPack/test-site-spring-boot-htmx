package com.benchmark.test_site_spring_boot_htmx.web.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import com.benchmark.test_site_spring_boot_htmx.web.models.Category;

@Repository
public interface ICategoryRepository extends JpaRepository<Category, Integer> {
    List<Category> findAll();

}
