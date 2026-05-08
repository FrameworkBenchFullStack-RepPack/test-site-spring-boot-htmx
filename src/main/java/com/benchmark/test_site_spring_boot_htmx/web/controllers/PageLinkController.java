package com.benchmark.test_site_spring_boot_htmx.web.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

import com.benchmark.test_site_spring_boot_htmx.web.models.PageLink;

@ControllerAdvice
public class PageLinkController {
    @ModelAttribute("links")
    public List<PageLink> Paths() {
        return List.of(
                new PageLink("Static 1", "/static-1"),
                new PageLink("Static 2", "/static-2"),
                new PageLink("Live", "/live"),
                new PageLink("List", "/list"));
    }
}
