## Requerimientos para levantar el proyecto

### Instalar python
```
sudo apt install python3
```

### Instalar pip (package manager)
```
sudo apt install python3-pip
```

## Para instalar las dependencias

### Abrir el entorno virtual
Esto es necesario para poder instalar las dependencias y para levantar el proyecto. De esta forma todo lo que se instala se hace en ese entorno virtual (que es la carpetita ".venv")
Asi que de ahora en adelante, ejecutar todos los comandos una vez creado y activado el entorno virtual.

Crear el entorno virtual con
```
python -m venv .venv
```

Abrirlo con
```
source .venv/bin/activate
```

### Instalar las dependencias
```
pip install -r requirements.txt
```

### Para desinstalar
```
pip uninstall -r requirements.txt
```

## Para levantar el proyecto
```
python3 main.py
```
