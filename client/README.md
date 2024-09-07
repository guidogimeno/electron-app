# Electron Tutorial

# TODO
1. Guardar porqueria en archivo temp dentro de reports/:reportId
2. Que el script reciba path de la tomo y ruta en donde se encuentra el "reports"
3. Que al terminar de ejecutar, se borre lo que esta en temp, falle o salga bien.
4. Que guarde las imagenes 
5. Que el json tenga formato para leerlo de forma dinamica
6. Hacer el instalador para Windows

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

