package com.example.plat_back.dto;

import lombok.Data;


@Data
public class RunCodeRequestDto {
    private String code;
    private String examId;
    private String studentId;
    private Integer langageId; 
}
