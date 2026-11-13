```text
A: READ(base) ---------------- WRITE(A)
B:       READ(base) ---------------- WRITE(B)
Resultado inseguro: B sobrescribe la decisión de A.
Corrección: cola de mensajes serializa A y B; cada escritura observa el estado comprometido anterior.
```
