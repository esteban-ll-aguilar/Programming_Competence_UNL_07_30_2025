# OpenAI API y recomendaciones para organización de cajones

Para utilizar esta funcionalidad:

1. Configura la clave API de OpenAI en las variables de entorno:
   ```
   OPENAI_API_KEY=tu-clave-api-de-openai
   OPENAI_ORGANIZATION=tu-id-de-organizacion (opcional)
   ```

2. Utiliza los endpoints para obtener recomendaciones y aplicarlas:

   - `POST /v1/ai/drawer-recommendations`
     Analiza un cajón y proporciona recomendaciones para mejor organización.
     
   - `POST /v1/ai/apply-recommendations`
     Aplica las recomendaciones generadas por la IA a un cajón específico.

## Ejemplos de uso

### Obtener recomendaciones

```json
POST /v1/ai/drawer-recommendations
{
  "drawer_id": 1
}
```

### Aplicar recomendaciones

```json
POST /v1/ai/apply-recommendations
{
  "drawer_id": 1,
  "actions": {
    "eliminar_duplicados": true,
    "ordenar_por_tipo": true,
    "ordenar_por_tamanio": false
  }
}
```

## Formato de respuesta

La respuesta de las recomendaciones tiene el siguiente formato:

```json
{
  "recomendaciones": [
    "Eliminar objetos duplicados",
    "Ordenar objetos por tipo"
  ],
  "mensajes": [
    "Se encontraron 3 objetos duplicados"
  ],
  "acciones": {
    "eliminar_duplicados": true,
    "ordenar_por_tipo": true,
    "ordenar_por_tamanio": false
  }
}
```
