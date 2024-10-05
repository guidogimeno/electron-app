# Electron Tutorial

# TODO
0. Hacerlo andar bien en MacOS el loading
2. Poder exportar a PDF.
1. Que se guarde todo en una carpeta temporal, para que al darle Submit al reporte pase a una carpeta donde esten los "terminados". Borrar la "basura" no importa, solo tiene que servir para la demo.
8. Cuando el usuario hace el analisis tiene que poder agregarle un nombre al reporte o algo con una descripcion. No podemos usar ese ID horrendo.

3. Cambiar el disenio de algunos botones.
4. Arreglar el loading en MacOS.
5. Cambiar el color de los mensajes de error, son muy rojos.
6. Quizas achicar la letra.
7. Poner un nombre por defecto a los angulos que no tienen nombre.
9. Alinear el header

## Guia de Instalacion

1. Instalar NVM - https://github.com/nvm-sh/nvm
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```
```
source ~/.bashrc
```

2. Instalar Node >= v18 y npm >= v.9.5.x
Parado en el proyecto dentro de esta misma carpeta
```
nvm use
```
Continuar con las indicaciones de nvm

3. Instalar dependencias
```
npm i
```

4. Hot Reload
(Ejecutar en otra terminal)
```
npm run watch
```

5. Levantar el proyecto
```
npm run dev
````

6. Crear instalador
```
npm run make
```

## Arquitectura de Electron
![image](https://github.com/guidogimeno/electron-app/assets/36056989/0a92ba05-8719-416e-998d-0965a7f80e88)

