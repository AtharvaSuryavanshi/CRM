package com.orbit.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "agent")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"manager", "leads"}) // avoid infinite loop

public class Agent {

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

    @Column
    private String area;

    // ✅ Many Agents belong to one Manager
    @ManyToOne
    @JoinColumn(name = "manager_id")
    private Manager manager;
    @JsonIgnoreProperties("agent")

    // ✅ One Agent handles many Leads
    @OneToMany(mappedBy = "agent", cascade = CascadeType.ALL)
    private List<Lead> leads;
}