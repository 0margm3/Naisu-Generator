# Naisu Generator (WIP)

A Web Application that can Convert C Language to Nassi-shneiderman Diagram

### Whats Currently working?

- Can create a diagram for a single `Main()` Function
- Diagram for Flow Control (i.e., If-else, for, while, and do-while)
- instruction/statement i.e., `printf("...");`

### Whats is not current working?

- Diagram for Switch statement
  ```C
  switch(){
      case 1:
      case 2: break;
  }
  ```
- Diagram for Multiple User-defined functions
  ```C
  int main(){
      // ...
  }
  void foo(){
      // ...
  }
  ```
