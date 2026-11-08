# # Trabajo práctico 10 - Consultas de reservas paso a paso

Este proyecto extiende la aplicación web de gestión y consulta de salas de estudio utilizando **Node.js**, **Express** y **MongoDB Atlas**. En esta unidad, se añadieron funcionalidades avanzadas de consulta en el listado de la API (`GET /api/reservas`), tales como filtrado, ordenamiento parametrizado, paginación controlada con metadatos y proyección de campos esenciales.

## Descripción

La aplicación expone un CRUD completo de reservas junto con un sistema híbrido de vistas HTML y endpoints de API JSON. Las modificaciones de esta entrega se enfocan en optimizar las búsquedas en la base de datos permitiendo al cliente:
*   **Filtrar** de forma exacta por sala de estudio.
*   **Ordenar** por estudiante u ocupación (ascendente y descendente) con criterios de desempate consistentes.
*   **Paginar** los resultados para evitar sobrecargas, devolviendo metadatos precisos (`pagina`, `limite`, `total`, `paginas`).
*   **Proyectar** únicamente los campos públicos requeridos, manteniendo la encapsulación interna de MongoDB.

## Instalación

1.  Asegúrate de clonar o copiar este proyecto en tu espacio de trabajo local.
2.  Instala las dependencias estrictamente declaradas en el manifiesto utilizando el modo de instalación limpia:
    ```bash
    npm ci
    ```
3.  Verifica la consistencia del código mediante el linter configurado ejecutando:
    ```bash
    npm run check
    ```

## Ejecución

Antes de levantar la aplicación, es indispensable validar que la infraestructura de base de datos se encuentre accesible.

1.  Comprueba la conexión con MongoDB Atlas mediante el script de diagnóstico:
    ```bash
    node --env-file=.env scripts/comprobar-conexion.js
    ```
2.  Si la verificación es exitosa, inicia el servidor de desarrollo ejecutando:
    ```bash
    node --env-file=.env src/index.js
    ```

*El servidor escuchará de forma predeterminada en el puerto `3000`.*

## Variables de Entorno (.env.example)

Para el despliegue del proyecto, configura un archivo local `.env` basado en el siguiente esquema de marcadores (asegúrate de no publicar credenciales reales en tu repositorio público de GitHub):

```env
PORT=3000
MONGODB_URI=mongodb+srv://<USUARIO>:<PASSWORD>@<CLUSTER>.mongodb.net/reservas_salas_u10?retryWrites=true&w=share
```

## Rutas

### Vistas HTML
*   `GET /reservas` - Listado renderizado de todas las reservas registradas.
*   `GET /reservas/nueva` - Formulario de creación de reservas.
*   `GET /reservas/:id` - Detalle visual de una reserva específica.

### API Pública (`/api/reservas`)
*   `GET /api/reservas` - Listado dinámico con filtros, orden y paginación.
*   `GET /api/reservas/:id` - Obtención de un documento individual por su ID.
*   `POST /api/reservas` - Alta de nueva reserva (devuelve código `201` y cabecera `Location`).
*   `PUT /api/reservas/:id` - Reemplazo absoluto de los datos de una reserva.
*   `PATCH /api/reservas/:id` - Modificación parcial (limitado a cantidad de personas o estado).
*   `DELETE /api/reservas/:id` - Eliminación del registro (devuelve código `204`).
*   `GET /api/reservas/estado` - Estado operativo del servicio y conteo global e histórico de documentos.

## Pipeline de Middleware

El flujo de procesamiento de las solicitudes entrantes sigue una cadena de responsabilidades estrictamente ordenada:

[Solicitud Cliente]
↓
morgan("dev")              # Registro de logs de la petición HTTP
↓
identificarSolicitud          # Inyección de identificadores únicos (idSolicitud)
↓
medirDuracion              # Rastreo de tiempos de respuesta del servidor
↓
expressLayouts              # Motor de plantillas y layouts para renderizado
↓
express.urlencoded / json     # Parseo de cuerpos de datos entrantes (Form/JSON)
↓
reservasRouter             # Enrutador principal de la aplicación
↓
validarDatosReserva          # (Rutas Mutables) Sanitización y comprobación de esquemas
↓
validarReemplazo/Actualizacion # (PUT/PATCH) Restricciones de negocio y campos editables
↓
[Handler Final]             # Controlador e interacción con el servicio MongoDB


## Alcance de cada Función

        *   `listarApi`: Controlador encargado de interceptar los `query parameters` de la URL, verificar que no existan parámetros prohibidos o duplicados, y despachar los valores validados al servicio.
        *   `consultar`: Función medular del servicio de persistencia. Traduce los parámetros del cliente en objetos nativos de Mongoose (`$match`, `$sort`), calcula el desplazamiento con `$skip` y delimita el conjunto final mediante `$limit` combinando una proyección optimizada.
        *   `contar`: Ejecuta un recuento total y directo de los documentos sobre la colección sin aplicar filtros de paginación, preservando la fidelidad del endpoint `/estado`.

## Validación

        El servidor implementa barreras rígidas ante entradas malformadas o malintencionadas en `listarApi`:
        *   **Parámetros permitidos:** Solo se aceptan de manera estricta `sala`, `orden`, `pagina` y `limite`. Cualquier otro parámetro inesperado gatilla un error `400 Bad Request`.
        *   **Filtro:** `sala` debe ser un texto con contenido no vacío tras un proceso de limpieza (`trim`).
        *   **Ordenamiento:** Limitado exclusivamente a los tokens de ordenación permitidos: `estudiante`, `personas-asc` y `personas-desc`.
        *   **Paginación:** Los parámetros `pagina` (rango 1 a 1000) y `limite` (rango 1 a 20) deben ser números enteros unívocos. Parámetros repetidos o valores decimales son explícitamente rechazados con un código `400`.

## Pruebas Manuales (Casos Postman)

        Para reproducir y constatar el comportamiento esperado del listado, configura las solicitudes en tu colección de Postman bajo las siguientes directrices:

        1.  **Sin parámetros activos:** Devuelve un máximo de 2 elementos, indicando los metadatos correspondientes a la primera página de la colección total.
        2.  **Filtrado por Sala Norte y Paginación Excedida:** Al consultar `sala=Sala Norte&pagina=3&limite=2`, la respuesta devolverá una estructura limpia con el estado `200 OK`, un arreglo de `datos` vacío, reflejando fielmente el recuento global (`total: 4`, `paginas: 2`).
        3.  **Inyección de parámetros inválidos:** Intentos de envío como `pagina=0`, `limite=21` o duplicación de llaves en la Query String (`pagina=1&pagina=2`) retornarán de inmediato un código `400 Bad Request` acompañado del JSON aclaratorio del error.
