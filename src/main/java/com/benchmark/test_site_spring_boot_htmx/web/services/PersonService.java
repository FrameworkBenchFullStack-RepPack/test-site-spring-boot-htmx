package com.benchmark.test_site_spring_boot_htmx.web.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.benchmark.test_site_spring_boot_htmx.web.models.Person;
import com.benchmark.test_site_spring_boot_htmx.web.repositories.IPersonRepository;

@Service
public class PersonService {
    private final IPersonRepository _repository;

    public PersonService(IPersonRepository repository) {
        this._repository = repository;
    }

    public List<Person> GetPeople(List<Integer> category, Integer ageFrom, Integer ageTo, Integer pageNum,
            Integer pageSize, String sortParam) {
        Integer age_from = ((ageFrom != null) && ageFrom >= 0 && ageFrom <= 100) ? ageFrom : 0;
        Integer age_to = ((ageTo != null) && ageTo >= 0 && ageTo <= 100) ? ageTo : 100;
        Integer page = ((pageNum != null) && pageNum >= 1 && pageNum <= 2000000) ? pageNum : 1;
        Integer size = ((pageSize != null) && pageSize >= 1 && pageSize <= 1000) ? pageSize : 1;
        String sort_param = (sortParam != null) ? sortParam.toLowerCase() : "";

        // Spring data siger at IN ikke kan være tom men gerne null :)
        if (category != null && category.isEmpty()) {
            category = null;
        }

        Sort sort;
        switch (sort_param) {
            case "age":
                sort = Sort.by(Sort.Direction.ASC, "age")
                        .and(Sort.by(Sort.Direction.ASC, "name"));
                break;
            case "category":
                sort = Sort.by(Sort.Direction.ASC, "category.name").and(Sort.by(Sort.Direction.ASC, "name"));
                break;
            default:
                sort = Sort.by(Sort.Direction.ASC, "name");
                break;
        }

        PageRequest pageRequest = PageRequest.of(page - 1, size, sort);

        Page<Person> result = _repository.findByFilters(category, age_from, age_to, pageRequest);

        return result.getContent();
    }
}
