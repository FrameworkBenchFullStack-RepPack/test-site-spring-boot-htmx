package com.benchmark.test_site_spring_boot_htmx.web.controllers;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import jakarta.servlet.http.HttpServletRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public String handleException(HttpServletRequest request) {
        return "redirect:" + request.getRequestURI();
    }
}
