package com.himanshu.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactInformationDto {
    private String email;
    private String mobile;
    private String twitter;
    private String instagram;
}
