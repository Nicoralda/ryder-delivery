# Ryder Delivery App

Esta app es una ***solución de gestión de flotas de entrega móvil diseñada para empresas que buscan optimizar el control total de sus operaciones de delivery internas***. Actualmente, muchas empresas gestionan sus entregas con procesos manuales (grupos de whatsapp, llamadas, hojas de cálculo), lo que genera baja eficiencia, errores constantes de tipado y dificultades en la generación de reportes

Esta app resuelve esos problemas al centralizar la gestión de pedidos y riders en una plataforma móvil, beneficiando tanto a los administradores con herramientas de control y análisis, como a los riders con una interfaz clara de asignación y seguimiento de pedidos


## Chécate los roles aquí:
La app está diseñada para dos tipos de usuarios, cada uno con un conjunto de funcionalidades específicas:

1. **Administrador (Admin)** 
- Gestión de riders 
- Crear, editar y ver el estado (activo/inactivo) de toda la flota de riders
- Gestión de Pedidos
- Crear nuevos pedidos, ver pedidos pendientes, asignar pedidos a riders específicos
- Gestionar y actualizar las tarifas de entrega por zonas
- Acceso a un dashboard con KPIs (pedidos completados, ingresos, promedios) con filtros de fecha 

1. **Delivery (Ryder)**
- Ver la lista de pedidos que le han sido asignados por el administrador
- Acceso a la vista de mapa para ver la ubicación del pedido y gestionar la ruta (pendiente de implementación completa)
- Botones de acción para cambiar el estado del pedido (iniciar recorrido, entregado, etc.)
- Historial para los pedidos que ha completado previamente


## Esta es la arquitectura de mi app:

- Framework: React Native (Expo Go)
- Gestión de estado: Redux Toolkit (para gestionar el estado global de usuario, pedidos, etc. de forma predecible)
- Persistencia local: Expo SQLite (para soportar modo offline y persistencia de datos)
- Backend y autenticación: Firebase Authentication y Firestore (para manejar login/signup seguro sin tener que armar backend propio)
- Navegación: React Navigation (para flujos diferenciados según rol (Admin / Ryder))
- Estilos: React Native StyleSheet


## Configuración e inicialización del proyecto aquí abajo:

### Requisitos previos:
1. Node.js y npm/Yarn instalados.
2. Expo Go app instalada en tu dispositivo móvil o emulador
3. Cuenta de Firebase con los servicios de Authentication y Firestore habilitados

### Instalación de dependencias:
1. Clona el repositorio
git clone https://github.com/Nicoralda/ryder-delivery.git
2. Ve a la carpeta del proyecto
cd ryder-delivery
3. Instala todas las dependencias con npm install

### Configurar Firebase
Crea un archivo llamado config.js dentro de la carpeta firebase/ (en la raíz del proyecto) y pega tus credenciales

### Inicializar bd (automático)
No se requiere acción manual. La aplicación inicializará automáticamente la base de datos local Expo SQLite y creará las tablas la primera vez que inicies el proyecto

### Inicia la app
Ejecuta npx expo start o escanea el código QR con tu app Expo Go


## Funcionalidades futuras
- Generación de reportes en PDF/CSV para admins
- Enviar notificaciones reales a riders inactivos (funcionalidad admin)
- Filtros avanzados por zona, rider y estado (funcionalidad admin)
- Aplicar cambio de tema a toda la app (tanto para rider como para admins)