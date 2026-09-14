package com.prasad.ticket;
import org.springframework.web.bind.annotation.*; import java.time.LocalDateTime; import java.util.*;
@RestController @RequestMapping("/api/tickets") @CrossOrigin(origins="*")
public class TicketController {
 private final TicketRepository repo; private final AiClient ai;
 public TicketController(TicketRepository r,AiClient a){repo=r;ai=a;}
 @GetMapping public List<Ticket> all(){return repo.findAll().stream().sorted(Comparator.comparing(Ticket::getCreatedAt,Comparator.nullsLast(Comparator.reverseOrder()))).toList();}
 @PostMapping public Ticket create(@RequestBody Ticket t){
  Map<String,String> input=Map.of("title",Optional.ofNullable(t.getTitle()).orElse(""),"description",Optional.ofNullable(t.getDescription()).orElse(""));
  Map<String,Object> x=ai.analyze(input); t.setCategory((String)x.get("category")); t.setPriority((String)x.get("priority")); t.setStatus("OPEN"); t.setCreatedAt(LocalDateTime.now()); if(t.getCreatedBy()==null)t.setCreatedBy("demo@user.com"); return repo.save(t);
 }
 @PutMapping("/{id}/status") public Ticket status(@PathVariable Long id,@RequestParam String value){Ticket t=repo.findById(id).orElseThrow();t.setStatus(value.toUpperCase());return repo.save(t);}
 @PutMapping("/{id}/assign") public Ticket assign(@PathVariable Long id,@RequestParam String value){Ticket t=repo.findById(id).orElseThrow();t.setAssignedTo(value);return repo.save(t);}
 @DeleteMapping("/{id}") public void delete(@PathVariable Long id){repo.deleteById(id);}
}