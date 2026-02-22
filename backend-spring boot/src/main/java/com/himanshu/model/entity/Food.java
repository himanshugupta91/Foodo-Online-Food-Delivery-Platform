package com.himanshu.model.entity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Food {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Food name is required")
    private String name;

    @Column(length = 1000)
    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Long price;

    @ManyToOne(fetch = FetchType.LAZY)
    private Category foodCategory;

    @ElementCollection
    @Column(length = 1000)
    @Builder.Default
    private List<String> images = new ArrayList<>();

    private boolean available;

    // @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    private Restaurant restaurant;

    private boolean vegetarian;
    private boolean seasonal;

    @ManyToMany
    @Builder.Default
    private List<IngredientsItem> ingredients = new ArrayList<>();

    @Temporal(TemporalType.TIMESTAMP)
    private Date creationDate;

}
