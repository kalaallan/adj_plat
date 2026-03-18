package com.example.plat_back.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Tous les fichiers de D:/uploads/ seront accessibles via /uploads/ dans l'URL
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:/D:/uploads/");
    }
}