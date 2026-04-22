# Kala Bot Response UI

## Propósito

**Kala Bot Response UI** es una aplicación web para monitorear y gestionar comentarios recibidos en publicaciones de Kala en Facebook e Instagram. La aplicación permite consultar comentarios, revisar la respuesta generada por el agente Kala y operar los módulos de comentarios, publicaciones y chat desde una interfaz unificada.

La aplicación es únicamente la capa de interfaz. Toda la información se obtiene y se actualiza mediante una API HTTP REST.
 
## Alcance

1. **index**: Dashboard para visualizar comentarios registrados y aplicar filtros operativos.
2. **posts**: Pantalla para administrar publicaciones configuradas en el sistema..
3. **chat**: Interfaz conversacional para interactuar con el agente Kala.

## Reglas Generales
- La UI consume datos desde servicios REST.
- La lógica de negocio y la persistencia no forman parte de esta aplicación.
- La aplicación debe mostrar estados y atributos usando los valores entregados por la API, con etiquetas legibles para el usuario.
- Las operaciones de edición o cambio de estado deben ejecutarse mediante la API.
- El término anular significa desactivar el registro, no eliminarlo físicamente.

## Pantallas

1. **Index**: Pantalla principal para consultar comentarios recibidos en publicaciones de Kala.

### Objetivo
Permitir al usuario ver los comentarios del día, revisar su estado y consultar la respuesta asociada.

### Comportamiento

- Al cargar la pantalla, deben mostrarse todos los comentarios de la fecha actual.
- La consulta inicial debe incluir todos los estados disponibles para la fecha actual.
- El usuario puede filtrar por fecha y estado.
- La fecha del día debe corresponder a la configuración horaria definida por el backend. Si el backend no provee esa referencia, se utilizará la fecha local del navegador.

### Estados de comentarios

- Pendiente: PENDING
- En espera: WAITING
- Procesado: PROCESSED

### Datos visibles por comentario

- Nombre del usuario
- Mensaje del comentario
- Respuesta generada o asociada
- Estado

2. **Posts**

Pantalla para consultar y administrar publicaciones registradas en el sistema.

### Objetivo

Permitir listar publicaciones, modificar sus datos y desactivarlas cuando ya no deban participar en el proceso.

### Comportamiento

- La pantalla debe permitir listar publicaciones existentes.
- La pantalla debe permitir editar una publicación.
- La pantalla debe permitir desactivar una publicación.
- Desactivar una publicación equivale a cambiar su estado a INACTIVE.

### Estados de publicaciones
- Activo: ACTIVE
- Inactivo: INACTIVE

### Atributos de cada publicación

- post_id
- plataforma
- fecha_creacion
- producto
- estado

### Valores permitidos para plataforma

- Facebook
- Instagram

3. **Chat**

Pantalla de conversación con el agente Kala.

### Objetivo
Permitir al usuario enviar mensajes y recibir respuestas del agente en formato de chat.

### Comportamiento

- La interfaz debe mostrar el historial de la conversación activa.
- El usuario debe poder escribir y enviar mensajes.
- El sistema debe mostrar las respuestas del agente Kala en la misma conversación.
- La UI de chat debe estar orientada a mensajes de texto.
- El alcance inicial no incluye llamadas, audio ni archivos adjuntos, salvo que la API lo soporte explícitamente en una fase posterior.
