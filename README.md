# Yggdrasil System: La Plataforma de Gestión de Formularios Conectada

![Yggdrasil](media/yggdrasil_logo.png)

## Descripción General

**Yggdrasil System** es una plataforma integral diseñada para la creación, gestión y procesamiento de una amplia variedad de formularios (encuestas, evaluaciones, peticiones, etc.). Su arquitectura modular, basada en contenedores y aplicaciones dedicadas, asegura la escalabilidad, la eficiencia y la robustez del sistema. Inspirado en la mitología nórdica, cada componente clave del sistema recibe un nombre evocador que refleja su función y su lugar dentro de la estructura general.

## Arquitectura

El sistema se compone de los siguientes elementos principales:

* **Aplicación Principal (El Sistema en su Totalidad):**
    * **Yggdrasil System:** El árbol de la vida que conecta todos los mundos. Esta es la plataforma unificada que integra todas las funcionalidades, desde la gestión de formularios hasta la interacción con usuarios y técnicos en terreno, permitiendo un flujo de información cohesivo.

* **Backend (El Corazón del Poder):**
    * **Valhalla Core:** El salón de los héroes y centro de poder. Este es el núcleo de procesamiento de la aplicación, donde se gestionan las peticiones, se interactúa con la base de datos y se coordinan las tareas.

        * **Mimir's Well (MariaDB):** La fuente de toda sabiduría y conocimiento. Este contenedor alberga la base de datos principal, donde se almacena de forma persistente toda la información esencial de la aplicación: la estructura de los formularios, las respuestas de los usuarios, los perfiles, los estados y las propiedades.

        * **Odin's Ravensight (Redis):** La visión rápida y perspicaz de la información. Este contenedor proporciona una capa de caché de alta velocidad para los datos accedidos con frecuencia, permitiendo que la aplicación responda rápidamente a las peticiones y optimizando el rendimiento general.

        * **Norns' Loom (Celery):** El telar del destino que teje los eventos en el tiempo. Este contenedor gestiona las tareas asíncronas y programadas, como el procesamiento de grandes volúmenes de datos, la generación de informes periódicos y otras operaciones que no requieren una respuesta inmediata al usuario.

        * **Hermod's Messenger (Sendmail):** El veloz mensajero que entrega comunicaciones. Este contenedor se encarga del envío de correos electrónicos desde la aplicación, ya sean notificaciones a los usuarios, alertas a los administradores o cualquier otra comunicación por correo electrónico necesaria para el funcionamiento del sistema.

        * **Fafnir's Hoard (Minio):** El tesoro donde se guardan los objetos valiosos. Este contenedor proporciona almacenamiento de objetos para todos los archivos adjuntos y evidencias que se cargan a través de los formularios, permitiendo una gestión eficiente y escalable de los recursos digitales.

* **API (El Puente de Conexión):**
    * **Bifrost Gateway:** El puente arcoíris que conecta diferentes reinos. Esta es la interfaz que permite la comunicación entre el backend y las diferentes interfaces de usuario (web y móviles), exponiendo las funcionalidades del backend de manera estructurada y segura.

* **Frontend Web (La Torre de Observación Administrativa):**
    * **Hlidskjalf Console:** El trono alto desde donde se observa todo. Esta es la interfaz web principal para los administradores del sistema. Desde aquí, pueden gestionar los usuarios, crear y configurar los formularios, visualizar los datos recopilados y tener una visión general del funcionamiento de la aplicación.

* **App Soporte Terreno:**
    * **Huginn & Freki Field:** Los agentes de pensamiento y búsqueda en el terreno. Esta aplicación móvil está diseñada para el uso de técnicos en terreno. Les permite acceder a formularios específicos para realizar evaluaciones, inspecciones o recopilar información directamente en el lugar. También puede ofrecer funcionalidades para la gestión de tareas asignadas y la carga de evidencias (que se almacenan en Minio).

* **App Usuarios Generales:**
    * **Muninn & Geri Access:** La puerta a la memoria y la interacción. Esta aplicación móvil está destinada a los usuarios finales. Les permite acceder a los diferentes tipos de formularios (encuestas, peticiones, etc.) y completarlos, así como posiblemente revisar su historial de respuestas o acceder a información relevante dentro del sistema.

## Contenido Adicional
Este README proporciona una visión general de la arquitectura y los componentes principales de **Yggdrasil System**. Para obtener información detallada sobre la instalación, configuración y uso de cada parte del sistema, consulta los archivos de documentación específicos.