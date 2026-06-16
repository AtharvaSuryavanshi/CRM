package com.orbit.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "manager")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"admin", "agents"}) // avoid recursion

public class Manager {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;

    @Column(unique = true)
    private String email;

    @Column
    private String password;

    @Column
    private String phone;

    @Column
    private Boolean status;

    @Column
    private LocalDateTime date;

    // ✅ Many Managers belong to one Admin
    @ManyToOne
    @JoinColumn(name = "admin_id")	
    private Admin admin;
    @JsonIgnore
    // ✅ One Manager has many Agents
    @OneToMany(mappedBy = "manager", cascade = CascadeType.ALL)
    private List<Agent> agents;
}