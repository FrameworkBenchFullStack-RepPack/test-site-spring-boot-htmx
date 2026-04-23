package com.benchmark.test_site_spring_boot_htmx.web.controllers;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.benchmark.test_site_spring_boot_htmx.web.models.Category;
import com.benchmark.test_site_spring_boot_htmx.web.repositories.ICategoryRepository;
import com.benchmark.test_site_spring_boot_htmx.web.services.PersonService;

@Controller
public class ListController {

    private final PersonService personService;
    private final ICategoryRepository categoryRepository;

    public ListController(PersonService personService, ICategoryRepository categoryRepository) {
        this.personService = personService;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping("/list")
    public String list(
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) Integer age_from,
            @RequestParam(required = false) Integer age_to,
            @RequestParam(required = false) List<Integer> category,
            @RequestParam(required = false, defaultValue = "100") Integer size,
            @RequestParam(required = false, defaultValue = "1") Integer page_num,
            Model model) {

        if (size == null || size < 1 || size > 1000)
            size = 100;
        if (page_num == null || page_num < 1 || page_num > 2000000)
            page_num = 1;

        List<Category> categories = categoryRepository.findAll()
                .stream().sorted(Comparator.comparing(Category::getName)).toList();

        List<Integer> allCategoryIds = categories.stream().map(Category::getId).toList();

        List<Integer> validCategory = (category != null)
                ? category.stream().filter(Objects::nonNull).filter(allCategoryIds::contains).collect(Collectors.toList())
                : null;

        List<Integer> selectedCategories = (validCategory != null && !validCategory.isEmpty())
                ? validCategory
                : allCategoryIds;

        model.addAttribute("title", "List");
        model.addAttribute("sticky", true);
        model.addAttribute("categories", categories);
        model.addAttribute("selectedCategories", selectedCategories);
        model.addAttribute("sort", sort != null ? sort : "name");
        model.addAttribute("age_from", age_from != null ? age_from : 0);
        model.addAttribute("age_to", age_to != null ? age_to : 100);
        model.addAttribute("size", size);
        model.addAttribute("page_num", page_num);
        model.addAttribute("people",
                personService.GetPeople(selectedCategories, age_from, age_to, page_num, size, sort));

        return "list";
    }

    @GetMapping("/list/data")
    public String listData(
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) Integer age_from,
            @RequestParam(required = false) Integer age_to,
            @RequestParam(required = false) List<Integer> category,
            @RequestParam(required = false, defaultValue = "20") Integer size,
            @RequestParam(required = false, defaultValue = "1") Integer page_num,
            Model model) {

        model.addAttribute("people", personService.GetPeople(category, age_from, age_to, page_num, size, sort));

        return "components/list-results :: results";
    }
}
