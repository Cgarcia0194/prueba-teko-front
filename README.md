# Prueba Front-End

### How to Run:
1. Descargar proyecto
2. Ir a la carpeta del proyecto y con el comando `npm install/i` instalar las dependencias
3. Una vez descargadas las dependencias que usa el proyecto ir a la carpeta `src/helpers/conn-back.js` y modificar la variable `API_URL` con el servidor virtual o con  la url que proporciona artisan dependiendo como se ejecutó el backend. La variable debe quedar algo así:
http://127.0.0.1:8000/api/ (cuando es artisan) o
http://www.laravel-prueba.com.mx:8084/api/ (cuando se crea en un servidor virtual), en ambos casos se debe apuntar hacia `/api/`
4. Correr la aplicación con `npm run serve`.
