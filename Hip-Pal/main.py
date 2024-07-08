import os
import numpy as np
import matplotlib.pyplot as plt
import DeteccionCabezaFemur.cabeza_femur as cabeza_femur
import AngulosSectorAcetabular.angulos_Sector_Actabular as angulos_Sector_Actabular
import ProcesamientoDicom.procesar as procesar



def main():
    #Definimos el tipo de angulo a calcular
    tipo_angulo="SectorAcetabular" ##Puede ser SectorAcetabular o CentroBorde

    #Declara variables necesarias para encontrar los maximos circulos de cada femur.
    max_radio_derecho = 0
    imagen_centroide_derecho = None
    nombre_imagen_centroide_derecho = None
    imagen_original_centroide_derecho = None
    corte_HU200_centroide_derecho = None
    circulos_derecho_max_radio = None


    circulos_izquierdo_max_radio=None
    max_radio_izquierdo=0
    imagen_centroide_izquierdo= None
    nombre_imagen_centroide_izquierdo=None
    contadorDetecciones=0


    #Levanta la carpeta con los Dicoms.
    carpeta_dicom = r".\Tomografias\Tomografias1"
    archivos_dicom = [os.path.join(carpeta_dicom, archivo) for archivo in os.listdir(carpeta_dicom) if archivo.endswith('.dcm')]

    #Itera por cada archivo .dcm
    for ruta_archivo_dicom in archivos_dicom:
        try:
            #Toma el corte y detecta ambas cabezas de femur.
            corte_original, nombre_archivo, corte_sin_ruido, corte_limpio_desenfocado = procesar.procesar_archivo(ruta_archivo_dicom)
            
            cabeza_femur_derecho,cabeza_femur_izquierdo=cabeza_femur.detectarPosibleCabeza(corte_limpio_desenfocado)

            #Logica para guardar el mayor circulo izquierdo.
            if cabeza_femur_izquierdo is not None:
                x,y,r=cabeza_femur_izquierdo
                if r > max_radio_izquierdo:
                    max_radio_izquierdo=r
                    imagen_centroide_izquierdo = corte_original
                    nombre_imagen_centroide_izquierdo = nombre_archivo
                    imagen_original_centroide_izquierdo = corte_original
                    corte_HU200_centroide_izquierdo = corte_sin_ruido
                    #corte_derecho_desenfocado = imagen_hueso_desenfocada
                    circulos_izquierdo_max_radio = x,y,r
                    #circulos_derecho_max_radio = x + imagen_hueso_desenfocada.shape[1] // 2,y,r

            #Lógica para guardar el mayor circulo derecho.
            if cabeza_femur_derecho is not None:
                contadorDetecciones+=1
                x,y,r=cabeza_femur_derecho
                #Correccion dado que cortamos la imagen en 2 para detectar los circulos.
                x,y,r = x + corte_limpio_desenfocado.shape[1] // 2, y, r

                #Si el radio del circulo actual es mayor al historico me lo guardo.
                if r > max_radio_derecho:
                    max_radio_derecho = r
                    imagen_centroide_derecho = corte_original
                    nombre_imagen_centroide_derecho = nombre_archivo
                    imagen_original_centroide_derecho = corte_original
                    corte_HU200_centroide_derecho = corte_sin_ruido
                    corte_derecho_desenfocado = corte_limpio_desenfocado
                    circulos_derecho_max_radio = x,y,r

        except Exception as e:
            print(f"Error procesando {ruta_archivo_dicom}: {e}")

    if(tipo_angulo=="SectorAcetabular"):
        angulos_Sector_Actabular.calcular_Angulos_Sector_Acetabular(imagen_centroide_izquierdo,nombre_imagen_centroide_izquierdo,corte_HU200_centroide_izquierdo,imagen_centroide_derecho,imagen_original_centroide_derecho,nombre_imagen_centroide_derecho,corte_HU200_centroide_derecho,circulos_izquierdo_max_radio,circulos_derecho_max_radio,max_radio_izquierdo,max_radio_derecho)
        print("Total de cortes donde Detecto Femur Derecho: " + str(contadorDetecciones))



if __name__ == "__main__":
    main()
