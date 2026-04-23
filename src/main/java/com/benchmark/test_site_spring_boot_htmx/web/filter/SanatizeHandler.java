package com.benchmark.test_site_spring_boot_htmx.web.filter;

import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class SanatizeHandler extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filter)
            throws ServletException, IOException {

        String queryString = request.getQueryString();

        if (queryString != null && (queryString.contains("{}") || queryString.contains("[]"))) {
            String cleanUrl = request.getRequestURI();

            response.sendRedirect(cleanUrl);
            return;
        }

        filter.doFilter(request, response);
    }
}
