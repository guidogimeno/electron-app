import nibabel as nib
import os
from Excepciones.Excepciones import ErrorDetectandoAngulos, ErrorIntermedialNotFound, ErrorProximalEcuatorialNotFound, ErrorCantidadEtiquetas
import SectorAcetabular.sectorAcetabular as sectorAcetabular
import SectorAcetabular.Utils.detectar as detectar
import json
from TCtoNiigz import dcm_to_nii
from Inferencia import segmentar
import numpy as np

def main():
  # print("GUIDO DEBUG: empieza")
   # dcm_to_nii()
    #print("GUIDO DEBUG: sali de aca")



    # Load the NIfTI file
    img = nib.load(r"C:\Users\Usuario\anaconda3\envs\monailabel-env\Hip-Pal_v2\Tomografia\Prediccion\CT_7_seg.nii.gz")

    # Get the image data and affine matrix
    data = img.get_fdata()
    affine = img.affine

    # Flip the axial slices (z-axis)
    flipped_data = np.flip(data, axis=1)

    # Get the affine matrix
    affine = img.affine
    # Example: Flip the y-axis
    affine[1, 1] = -affine[1, 1]
    affine[1, 3] = -affine[1, 3]
        # Save the flipped image
    flipped_img = nib.Nifti1Image(flipped_data, affine)
    nib.save(flipped_img,  r"C:\Users\Usuario\anaconda3\envs\monailabel-env\Hip-Pal_v2\Tomografia\Prediccion\CT_7_seg_rotada.nii.gz")

    print("Axial slices flipped and saved to 'flipped_image.nii.gz'")


    # predecimos
    print("GUIDO DEBUG: empieza la segmentacion")
    segmentar()
    print("GUIDO DEBUG: segmentacion finalizada")

    # try:
    #     ruta_json_resultados = r'C:\Users\Usuario\anaconda3\envs\monailabel-env\pruebas\angulos.json'
    #
    #
    #     #Deberia ir aca la Prediccion------------------------------------------------------------------------
    #     # Cargar la tomografía y la máscara
    #     tomografia_original_path = os.path.join('Tomografia', 'Original', 'CT_9.nii.gz')
    #     tomografia_original = nib.load(tomografia_original_path).get_fdata()
    #
    #     # Cargar prediccion----------------------------------------------------------------------------------
    #     tomografia_segmentada_path = os.path.join('Tomografia', 'Prediccion', 'CT_9_seg.nii.gz')
    #     tomografia_segmentada = nib.load(tomografia_segmentada_path).get_fdata()
    #
    #
    #     #Verificacion de etiquetas--------------------------------------------------------
    #     # Verifica si la máscara tiene múltiples etiquetas
    #     if tomografia_segmentada.ndim != 4 and tomografia_segmentada.shape[3] != 8:
    #         raise ErrorCantidadEtiquetas(
    #         "La máscara no tiene el formato esperado de 8 etiquetas.",
    #         detalles=f"Dimensiones: {tomografia_segmentada.ndim}, Shape: {tomografia_segmentada.shape}"
    #     )
    #
    #
    #     #Detecto cabeza femur en el axial (Proximal, Intermedial y Ecuatorial)-------------
    #     cabezas_femur_axiales = sectorAcetabular.detectar(tomografia_segmentada)
    #
    #     #Detecta angulos sector Acetabular-------------------------------------------------
    #     angulosSectorAcetabular = detectar.detectar(cabezas_femur_axiales,tomografia_original,tomografia_segmentada)
    #
    #     # Guardo el JSON en el archivo------------------------------------------------------
    #     with open(ruta_json_resultados, 'w') as archivo:
    #         json.dump(angulosSectorAcetabular, archivo, indent=4)  # indent=4 para un formato legible
    #
    #     print("Termino: 200")
    #     return 200
    # except ErrorCantidadEtiquetas as e:
    #     print(f"Error: {e}")
    #     print(f"Detalles adicionales: {e.detalles}")
    #     print("Termino: 404")
    #     return 404
    # except ErrorProximalEcuatorialNotFound as e:
    #     print(f"Error: {e}")
    #     print(f"Detalles adicionales: {e.detalles}")
    #     print("Termino: 500")
    #     return 500
    # except ErrorIntermedialNotFound as e:
    #     print(f"Error: {e}")
    #     print(f"Detalles adicionales: {e.detalles}")
    #     print("Termino: 500")
    #     return 500
    # except ErrorDetectandoAngulos as e:
    #     print(f"Error: {e}")
    #     print("Termino: 500")
    #     return 500




if __name__ == "__main__":
    main()
