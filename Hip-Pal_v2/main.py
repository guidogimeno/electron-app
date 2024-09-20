import nibabel as nib
import uuid
import os
import datetime
import argparse
from CentroBordeAnterior import centroBordeAnterior
from CentroBordeLateral import centroBordeLateral
from Excepciones.Excepciones import ErrorDetectandoAngulos, ErrorIntermedialNotFound, ErrorProximalEcuatorialNotFound, ErrorCantidadEtiquetas
import SectorAcetabular.sectorAcetabular as sectorAcetabular
import SectorAcetabular.Utils.detectar as detectar
import json
from TCtoNiigz import dcm_to_nii
from Inferencia import segmentar
from preprocesarSegmentacion import preprocesar


def main():
    id = str(uuid.uuid4())
    parser = argparse.ArgumentParser(
        description="Script para encontrar el directorio de tomografía a partir de una ruta y luego convertirlo a .nii.gz")
    parser.add_argument(
        "ruta", help="Ruta del directorio raíz para iniciar la búsqueda.")
    parser.add_argument("carpeta_salida",
                        help="Ruta a la carpeta donde quedara el .nii.gz")
    args = parser.parse_args()

    print("\nDEBUG: comienza busqueda y conversión de tomografia.")
    dcm_to_nii(id, args.ruta, args.carpeta_salida)
    print("\nDEBUG: termina conversión de tomografia.")

    print("\nDEBUG: comienza la prediccion/segmentacion")
    segmentar(id, args.carpeta_salida)
    print("\nDEBUG: comienza la prediccion/segmentacion")

    print("\nDEBUG: aplicamos preprocesamiento del segmentado")
    preprocesar(id, args.carpeta_salida)
    print("\nDEBUG: termina preprocesado")

    try:
        # CAMBIAR ESTA RUTA PARA GUARDAR EL JSON
        # ruta_json_resultados = r'C:\Users\Usuario\anaconda3\envs\monailabel-env\Hip-Pal_v2\angulos.json'
        ruta_json_resultados = os.path.join(
            args.carpeta_salida, 'reports', id, 'angulos.json')

        # CAMBIAR ESTAS RUTAS PARA TOMAR LA .NII NORMAL Y EL .NII SEGMENTADO
        # Deberia ir aca la Prediccion------------------------------------------------------------------------
        # Cargar la tomografía y la máscara
        # tomografia_original_path = os.path.join(
        #     'Tomografia', 'Original', 'CT_8.nii.gz')
        tomografia_original_path = os.path.join(
            args.carpeta_salida, 'reports', id, 'temp', f'{id}.nii.gz')
        tomografia_original = nib.load(tomografia_original_path).get_fdata()

        # Cargar prediccion----------------------------------------------------------------------------------
        tomografia_segmentada_path = os.path.join(args.carpeta_salida, 'reports', id, 'temp',
                                                  'tomografias_segmentadas', id, f'{id}_seg_flipendo.nii.gz')
        tomografia_segmentada = nib.load(
            tomografia_segmentada_path).get_fdata()

        # Verificacion de etiquetas--------------------------------------------------------
        # Verifica si la máscara tiene múltiples etiquetas
        if tomografia_segmentada.ndim != 4 and tomografia_segmentada.shape[3] != 8:
            raise ErrorCantidadEtiquetas(
                "La máscara no tiene el formato esperado de 8 etiquetas.",
                detalles=f"Dimensiones: {tomografia_segmentada.ndim}, Shape: {
                    tomografia_segmentada.shape}"
            )

        # Detecto cabeza femur en el axial (Proximal, Intermedial y Ecuatorial)-------------
        cabezas_femur_axiales = sectorAcetabular.detectar(
            tomografia_segmentada)

        # Detecta angulos sector Acetabular-------------------------------------------------
        angulosSectorAcetabular = detectar.detectar(id, args.carpeta_salida,
                                                    cabezas_femur_axiales, tomografia_original, tomografia_segmentada)

        # Detecta angulos Centro Borde Lateral-------------------------------------------------
        angulosCentroBordeLateral = centroBordeLateral.detectar(
            id, args.carpeta_salida, cabezas_femur_axiales, tomografia_original, tomografia_segmentada)

        # Detecta angulos Centro Borde Anterior-------------------------------------------------
        angulosCentroBordeAnterior=centroBordeAnterior.detectar(id, args.carpeta_salida,cabezas_femur_axiales, tomografia_original,tomografia_segmentada)


        now = datetime.datetime.now()
        timestamp_string = now.strftime("%Y-%m-%d %H:%M:%S")

        angulos = {
            "id": id,
            "name": f"Informe {id}",
            "createdDate": timestamp_string,
            "mediciones": [
                {
                    "name": "Sector Acetabular",
                    "angulos": angulosSectorAcetabular,
                },
                {
                    "name": "Centro Borde Lateral",
                    "angulos": angulosCentroBordeLateral,
                },
                {
                    "name": "Centro Borde Anterior",
                    "angulos": angulosCentroBordeAnterior,
                }
            ]
        }

        # Guardo el JSON en el archivo------------------------------------------------------
        with open(ruta_json_resultados, 'w') as archivo:
            # indent=4 para un formato legible
            json.dump(angulos, archivo, indent=4)

        print("Termino: 200")
        print(f"id:${id}")
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
        print(f"Detalles adicionales: {e.detalles}")
        print("Termino: 500")
        return 500


if __name__ == "__main__":
    main()
