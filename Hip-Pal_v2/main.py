from matplotlib import pyplot as plt
import nibabel as nib
import os
import numpy as np
from PreprocesamientoDeCorte import preprocesar
import SectorAcetabular.sectorAcetabular as sectorAcetabular
import SectorAcetabular.Utils.detectar as detectar
import json


# Cargar la tomografía y la máscara
tomografia_original_path = os.path.join('Tomografia', 'Original', 'CT_6.nii.gz')
tomografia_original = nib.load(tomografia_original_path).get_fdata()

# Cargar prediccion
tomografia_segmentada_path = os.path.join('Tomografia', 'Prediccion', 'CT_6_seg.nii.gz')
tomografia_segmentada = nib.load(tomografia_segmentada_path).get_fdata()




# Verifica si la máscara tiene múltiples etiquetas
if tomografia_segmentada.ndim != 4 and tomografia_segmentada.shape[3] != 8:
    raise ValueError("La máscara no tiene el formato esperado de 8 etiquetas.")



#Detecta angulos sector Acetabular
cabezas_femur_axiales = sectorAcetabular.detectar(tomografia_segmentada)

angulos = detectar.detectar(cabezas_femur_axiales,tomografia_original,tomografia_segmentada)

ruta_archivo = r'C:\Users\Usuario\anaconda3\envs\monailabel-env\pruebas\angulos.json'

# Guarda el JSON en el archivo
with open(ruta_archivo, 'w') as archivo:
    json.dump(angulos, archivo, indent=4)  # indent=4 para un formato legible

print("Termino.")