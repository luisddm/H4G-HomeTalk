# H4G-HomeTalk
Proyecto de HackForGood Valladolid 2016

Estos dos se pueden instalar en local?
json-server
http-server

Este proyecto tiene como objetivo poder controlar dispositivos eléctricos que cualquiera pueda tener en casa utilizando un bot de
Telegram desde cualquier lugar. Sus características son:
- Poder elegir un dispositivo de la casa
- Poder encender o apagar el dispositivo
- Comprobar el estado del dispositivo (encendido o apagado)
- Comprobar la potencia que está consumiendo el dispostivo y lanzar una alerta si es demasiado alta para evitar posibles problemas

El esquema es el siguiente:
DIBUJO

En la red local de nuestro hogar tendremos los dispositivos, conectados a la red eléctrica a través de ******** LAS COSAS DE potencia ***
y nuestro servidor. El servidor se podrá montar tanto en un ordenador personal como en una Raspberry PI o similar.

Existe también una interfaz web a la cual se puede acceder desde un navegador, y que muestra el histórico de potencias del dispositivo.
Cada unos cuantos segundos se refresca el gráfico. 

Hemos creado también un bot de telegram. Es tan sencillo como saludar al bot y escoger uno de los comandos que nos ofrece.
Se podrá elegir el dispositivo y posteriormente mandarle la orden correspondiente.
