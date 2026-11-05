# tp-09-salas-crud-mongodb


1. Origen de la copia
    El presente trabajo práctico se desarrolló a partir de una copia funcional del TP09.

    Proyecto base: tp-09-salas-crud-mongodb

2. Tecnologías y versiones
        ├── @eslint/js@10.0.1
        ├── ejs@6.0.1
        ├── eslint@10.12.0
        ├── express-ejs-layouts@2.5.1
        ├── express@5.2.1
        ├── mongoose@9.10.3
        ├── morgan@1.12.1
        └── prettier@3.9.9

3. Preparación de MongoDB Atlas
    Se Crea la base de datos:
        reservas_salas_u10
            |-> Coleccion: reservas

    Ya existe usario en Base de Datos creado anteriormente.
    Se obtuvo Cadena de conexion que se agrego a MONGODB_URI en valriables de entorno .env 
    Se configura la variable MONGODB_URI con cadena de conexion, usuario y contraseña.

4. Configuración del entorno
    Archivo .env basado en .env

    PORT=3000
    NODE_ENV=development
    MONGODB_URI="mongodb+srv://usuario:password@cluster0.ggyk4zc.mongodb.net/reservas_salas_u9?retryWrites=true&w=majority&appName=Cluster0"

    Las credenciales de acceso y cadenas de conexión no se publican en el repositorio. Las mismas se gestionan mediante variables de entorno y se distribuyen por canales privados.

5. Diagnostico DSNS Resolutores utilizados

    MongoDB Atlas utiliza registros DNS de tipo SRV y TXT para resolver las cadenas de conexión con prefijo mongodb+srv://. Durante el desarrollo se incorporó la configuración recomendada en la consigna dentro de src/config/base-datos.js:

    const dns = require("node:dns");
    dns.setServers(["8.8.8.8", "1.1.1.1"]);

6. Inicio
    * Instalación
    npm install

    * Inicio
    npm start

    * Servidor:
    http://localhost:3000

7. EVIDENCIAS
    Las evidencias se cargan en archivo docs/evidencias subido en url presentada.