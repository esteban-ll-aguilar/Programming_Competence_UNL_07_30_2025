## Structure
``` bash
app/
├── core/
│   ├── config.py
│   ├── exceptions.py
│   └── logging.py
├── domain/
│   ├── entities/         # Entidades de dominio
│   ├── value_objects/    # Objetos de valor
│   ├── services/         # Servicios de dominio
│   └── ports/            # Interfaces/contratos
│       ├── repositories/
│       └── services/
├── application/          # Casos de uso
│   ├── services/
│   └── use_cases/
├── infrastructure/       # Adaptadores
│   ├── persistence/
│   ├── external_apis/
│   └── messaging/
└── interfaces/
    ├── api/
    │   └── routes/
    └── schemas/
```

