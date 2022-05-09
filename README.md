# Prueba

### How to Run:
1. Descargar proyecto
2. Ir a la carpeta del proyecto y con el comando `npm install/i` instalar las dependencias
3. Una vez descargadas las dependencias que usa el proyecto ir a la carpeta `helpers/conn-back.js` y modificar la URL API_URL con el servidor virtual o con la url que proporciona artisan dependiendo como se ejecutó el backend. La variable debe quedar algo así:
http://127.0.0.1:8000/api/ `cuando es artisan`
http://www.laravel-prueba.com.mx:8084/api/ `cuando se crea en un servidor virtual`

<VirtualHost *:8084 >
	DocumentRoot "C:/AppServ/www/prueba-teko/prueba-teko-backend-main/public/"
	ServerName www.laravel-prueba.com.mx
	ErrorLog "logs/laravel-prueba-error.log"
	CustomLog "logs/laravel-prueba-access.log" common
</VirtualHost>
*`Host virtual como debe quedar apuntando a la carpeta public`

4. Correr la aplicación con `npm run serve`.
