# Electron Tutorial

# TODO
- Poder exportar a PDF.
- Cambiar el color de los mensajes de error, son muy rojos.
- Mejorar el header de alguna forma
- Cambiar --> Angulos Sectoriales Acetabulares
- Agregar --> Agregar IdHospital paciente cuando se va a segmentar.
- Agregar --> Una pestaña que englobe todas las mediciones. (prioridad alta)
- Cambiar --> En los campos que se completan poner la opcion de texto libre (prioridad baja)
- Agregar --> al reporte agregar datos completados ademas de angulos e imagenes.
- Agregar --> Nombre Paciente, Id y Edad al cuadro de reportes.
- Agregar --> Cuando estoy segmentando tomografia, si quiero salir e ir a "Mis Estudios" preguntar si estoy seguro de abortar.
- Agregar --> "esta procesando en segundo plano" al loading

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

