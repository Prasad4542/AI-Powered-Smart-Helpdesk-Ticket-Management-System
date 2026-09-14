package com.prasad.ticket;
import jakarta.persistence.*; import java.time.LocalDateTime;
@Entity public class Ticket {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 private String title; @Column(length=2000) private String description; private String category; private String priority; private String status; private String createdBy; private String assignedTo; private LocalDateTime createdAt;
 public Ticket(){} public Long getId(){return id;} public String getTitle(){return title;} public void setTitle(String v){title=v;} public String getDescription(){return description;} public void setDescription(String v){description=v;}
 public String getCategory(){return category;} public void setCategory(String v){category=v;} public String getPriority(){return priority;} public void setPriority(String v){priority=v;} public String getStatus(){return status;} public void setStatus(String v){status=v;}
 public String getCreatedBy(){return createdBy;} public void setCreatedBy(String v){createdBy=v;} public String getAssignedTo(){return assignedTo;} public void setAssignedTo(String v){assignedTo=v;}
 public LocalDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(LocalDateTime v){createdAt=v;}
}