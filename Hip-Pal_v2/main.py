import nibabel as nib
import os
from CentroBordeLateral import centroBordeLateral
from Excepciones.Excepciones import ErrorDetectandoAngulos, ErrorIntermedialNotFound, ErrorProximalEcuatorialNotFound, ErrorCantidadEtiquetas
import SectorAcetabular.sectorAcetabular as sectorAcetabular
import SectorAcetabular.Utils.detectar as detectar
import json
from TCtoNiigz import dcm_to_nii
from Inferencia import segmentar
from preprocesarSegmentacion import preprocesar


def main():
    
    print("\nDEBUG: comienza busqueda y conversión de tomografia.")
    dcm_to_nii()
    print("\nDEBUG: termina conversión de tomografia.")


    print("\nDEBUG: comienza la prediccion/segmentacion")
    segmentar()
    print("\nDEBUG: comienza la prediccion/segmentacion")


    print("\nDEBUG: aplicamos preprocesamiento del segmentado")
    preprocesar()
    print("\nDEBUG: termina preprocesado")
    
    
    try:
     #CAMBIAR ESTA RUTA PARA GUARDAR EL JSON
     ruta_json_resultados = r'C:\Users\Usuario\anaconda3\envs\monailabel-env\Hip-Pal_v2\angulos.json'
    
     #CAMBIAR ESTAS RUTAS PARA TOMAR LA .NII NORMAL Y EL .NII SEGMENTADO
        #Deberia ir aca la Prediccion------------------------------------------------------------------------
        # Cargar la tomografía y la máscara
     tomografia_original_path = os.path.join('Tomografia', 'Original', 'CT_8.nii.gz')
     tomografia_original = nib.load(tomografia_original_path).get_fdata()
    
        # Cargar prediccion----------------------------------------------------------------------------------
     tomografia_segmentada_path = os.path.join('Tomografia', 'Prediccion', 'CT_8_seg.nii.gz')
     tomografia_segmentada = nib.load(tomografia_segmentada_path).get_fdata()
    
    
         #Verificacion de etiquetas--------------------------------------------------------
         # Verifica si la máscara tiene múltiples etiquetas
     if tomografia_segmentada.ndim != 4 and tomografia_segmentada.shape[3] != 8:
             raise ErrorCantidadEtiquetas(
             "La máscara no tiene el formato esperado de 8 etiquetas.",
             detalles=f"Dimensiones: {tomografia_segmentada.ndim}, Shape: {tomografia_segmentada.shape}"
        )
    
    
     #Detecto cabeza femur en el axial (Proximal, Intermedial y Ecuatorial)-------------
     cabezas_femur_axiales = sectorAcetabular.detectar(tomografia_segmentada)
        
     #Detecta angulos sector Acetabular-------------------------------------------------
     angulosSectorAcetabular = detectar.detectar(cabezas_femur_axiales,tomografia_original,tomografia_segmentada)
    
     #Buscar el centroide del femur izquierdo desde la vista coronal
     centroBordeLateral.detectar(cabezas_femur_axiales,tomografia_original)
     
     # Guardo el JSON en el archivo------------------------------------------------------
     with open(ruta_json_resultados, 'w') as archivo:
          json.dump(angulosSectorAcetabular, archivo, indent=4)  # indent=4 para un formato legible
    
     print("Termino: 200")
     return 200
    except ErrorCantidadEtiquetas as e:
         print(f"Error: {e}")
         print(f"Detalles adicionales: {e.detalles}")
         print("Termino: 404")
         return 404
    except ErrorProximalEcuatorialNotFound as e:
         print(f"Error: {e}")
         print(f"Detalles adicionales: {e.detalles}")
         print("Termino: 500")
         return 500
    except ErrorIntermedialNotFound as e:
         print(f"Error: {e}")
         print(f"Detalles adicionales: {e.detalles}")
         print("Termino: 500")
         return 500
    except ErrorDetectandoAngulos as e:
         print(f"Error: {e}")
         print("Termino: 500")
         return 500


if __name__ == "__main__":
    main()
