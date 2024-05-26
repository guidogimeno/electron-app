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
