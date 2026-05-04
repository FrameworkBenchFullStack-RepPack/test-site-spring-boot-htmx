package com.benchmark.test_site_spring_boot_htmx.web.controllers;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.ui.Model;

import com.benchmark.test_site_spring_boot_htmx.web.models.Category;
import com.benchmark.test_site_spring_boot_htmx.web.repositories.ICategoryRepository;
import com.benchmark.test_site_spring_boot_htmx.web.services.PersonService;

@Controller
public class PageController {

    private final PersonService personService;
    private final ICategoryRepository categoryRepository;

    public PageController(PersonService personService, ICategoryRepository categoryRepository) {
        this.personService = personService;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping("/")
    public String home(
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) Integer age_from,
            @RequestParam(required = false) Integer age_to,
            @RequestParam(required = false) List<Integer> category,
            @RequestParam(required = false, defaultValue = "8") Integer size,
            @RequestParam(required = false, defaultValue = "1") Integer page_num,
            Model model) {

        if (size == null || size < 1 || size > 1000)
            size = 8;
        if (page_num == null || page_num < 1 || page_num > 2000000)
            page_num = 1;

        List<Category> categories = categoryRepository.findAll()
                .stream().sorted(Comparator.comparing(Category::getName)).toList();

        List<Integer> allCategoryIds = categories.stream().map(Category::getId).toList();

        List<Integer> validCategory = (category != null)
                ? category.stream().filter(Objects::nonNull).filter(allCategoryIds::contains)
                        .collect(Collectors.toList())
                : null;

        List<Integer> selectedCategories = (validCategory != null && !validCategory.isEmpty())
                ? validCategory
                : allCategoryIds;

        model.addAttribute("title", "Test site");
        model.addAttribute("hideHeader", true);
        model.addAttribute("sticky", false);
        model.addAttribute("categories", categories);
        model.addAttribute("selectedCategories", selectedCategories);
        model.addAttribute("sort", sort != null ? sort : "name");
        model.addAttribute("age_from", age_from != null ? age_from : 0);
        model.addAttribute("age_to", age_to != null ? age_to : 100);
        model.addAttribute("size", size);
        model.addAttribute("page_num", page_num);
        model.addAttribute("people",
                personService.GetPeople(selectedCategories, age_from, age_to, page_num, size, sort));

        return "index";
    }

    @GetMapping({ "/static-1", "/static-1/" })
    public String static1(Model model) {
        model.addAttribute("title", "Test site");
        return "static-1";
    }

    @GetMapping({ "/static-2", "/static-2/" })
    public String static2(Model model) {
        model.addAttribute("title", "Test site");
        return "static-2";
    }

    @GetMapping({ "/live", "/live/" })
    public String live(Model model) {
        model.addAttribute("title", "Test site");
        return "live";
    }

}
