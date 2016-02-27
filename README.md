# H4G-TalkHome
Proyecto para **HackForGood Valladolid 2016**

Grupo **VD03** [TALKHOME](http://hackforgood.net/talkhome/) (Reto **R252**)

Este proyecto tiene como objetivo poder controlar dispositivos eléctricos que cualquiera pueda tener en casa utilizando un bot de
Telegram desde cualquier lugar. Sus características son:
- Poder elegir un dispositivo de la casa.
- Poder encender o apagar el dispositivo.
- Comprobar el estado del dispositivo (encendido o apagado).
- Comprobar la potencia que está consumiendo el dispostivo y lanzar una alerta si es demasiado alta para evitar posibles problemas.

En la red local de nuestro hogar tendremos los electrodomésticos, que van conectados a la red eléctrica a través de smartplugs. Son dispositivos que miden la potencia consumida y son capaces de activar o desactivar el flujo eléctrico para conmutar lo que lleven enchufado.

El servidor que controlará el bot de Telegram se podrá montar tanto en un ordenador personal como en una Raspberry PI o similar.

Existe también una interfaz web a la cual se puede acceder desde un navegador, y que muestra el histórico de potencias del dispositivo.
Cada unos cuantos segundos se refresca el gráfico.

Instalación del software
===

Todo el código escrito es JavaScript (ES6) y la plataforma usada es [Node.js](https://nodejs.org), con lo cual es necesario instalarla en el ordenador.

Después se han de instalar los siguientes paquetes de npm de forma global:

```
(sudo) npm -g install json-server http-server
```

Instalar también el resto de paquetes de npm de forma local:

```
npm install
```

Arrancar los tres servidores en orden. El primero será arrancar la API que almacenará el histórico de datos.

```
npm run api
```

Arrancar el script que gestiona el bot. Este script usará sockets para comunicarse con los dispositivos que queremos operar.

```
npm run bot
```

Arrancar la interfaz web que nos mostrará el histórico de datos. Estará en el puerto 8080.

```
npm run web
```

Uso
===

Finalmente sólo queda agregar como amigo al bot de telegram @TalkHomeBot y gestionarlo con los comandos correspondientes.

Hemos creado también un bot de telegram. Es tan sencillo como saludar al bot y escoger uno de los comandos que nos ofrece.
Se podrá elegir el dispositivo y posteriormente mandarle la orden correspondiente.
