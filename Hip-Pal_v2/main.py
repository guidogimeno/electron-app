import nibabel as nib
import os
import SectorAcetabular.sectorAcetabular as sectorAcetabular




# Cargar la tomografía y la máscara
tomografia_original_path = os.path.join('Tomografia', 'Original', 'CT_8.nii.gz')
tomografia_original = nib.load(tomografia_original_path).get_fdata()

# Cargar prediccion
tomografia_segmentada_path = os.path.join('Tomografia', 'Prediccion', 'CT_8_seg.nii.gz')
tomografia_segmentada = nib.load(tomografia_segmentada_path).get_fdata()




# Verifica si la máscara tiene múltiples etiquetas
if tomografia_segmentada.ndim != 4 and tomografia_segmentada.shape[3] != 8:
    raise ValueError("La máscara no tiene el formato esperado de 8 etiquetas.")



#Detecta angulos sector Acetabular
sectorAcetabular.detectar(tomografia_original,tomografia_segmentada)



