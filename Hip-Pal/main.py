import os
import pydicom
import numpy as np
import cv2
import matplotlib.pyplot as plt
import AngulosSectorAcetabular.DeteccionCabezaFemur.cabeza_femur as cabeza_femur
import AngulosSectorAcetabular.angulos_Sector_Actabular as angulos_Sector_Actabular
import ProcesamientoDicom.procesar as procesar



def main():
    #Definimos el tipo de angulo a calcular
    #angulo="SectorAcetabular" ##Puede ser SectorAcetabular o CentroBorde

    #Declara variables necesarias para encontrar los maximos circulos de cada femur.
    max_radio_derecho = 0
    imagen_centroide_derecho = None
    nombre_imagen_centroide_derecho = None
    imagen_original_centroide_derecho = None
    corte_HU200_centroide_derecho = None
    circulos_derecho_max_radio = None
    imagen_aasa_izquierdo = None

    circulos_izquierdo_max_radio=None
    max_radio_izquierdo=0
    imagen_centroide_izquierdo= None
    nombre_imagen_centroide_izquierdo=None
    imagen_aasa_derecho=None


    #Levanta la carpeta con los Dicoms.
    carpeta_dicom = r".\Tomografias\Tomografias2"
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

    ### Aca calcula los Angulos Sector Acetabular ####
    if imagen_centroide_izquierdo is not None:
        imagen_aasa_izquierdo=angulos_Sector_Actabular.detectar(imagen_centroide_izquierdo,nombre_imagen_centroide_izquierdo,corte_HU200_centroide_izquierdo,circulos_izquierdo_max_radio,circulos_derecho_max_radio,"izquierdo",max_radio_izquierdo)
    else:
        print("No se encontro la cabeza del femur izquierdo en ningún archivo.")


    if imagen_centroide_derecho is not None:
            imagen_aasa_derecho=angulos_Sector_Actabular.detectar(imagen_original_centroide_derecho,nombre_imagen_centroide_derecho,corte_HU200_centroide_derecho,circulos_derecho_max_radio,circulos_izquierdo_max_radio,"derecho",max_radio_derecho)

    else:
        print("No se encontro la cabeza del femur derecho en ningún archivo.")


    #Fusiono ambas mitades para componer una sola imagen con ambos centroides.
    imagen_izquierda= imagen_aasa_izquierdo.shape[1] // 2
    mitad_imagen_izquierda = imagen_aasa_izquierdo[:,:imagen_izquierda]
    imagen_derecha= imagen_aasa_derecho.shape[1] // 2
    mitad_imagen_derecha = imagen_aasa_derecho[:,imagen_derecha:]
    imagen_con_centroides = np.hstack((mitad_imagen_izquierda, mitad_imagen_derecha))



    ##Muestro imagenes.
    plt.figure(figsize=(20, 5))

    plt.subplot(1, 4, 1)
    plt.title(nombre_imagen_centroide_izquierdo)
    plt.imshow(imagen_aasa_izquierdo, cmap='gray')
    plt.axis('off')

    plt.subplot(1, 4, 2)
    plt.title('Angulos Sector Acetabular')
    plt.imshow(imagen_con_centroides, cmap='gray')
    plt.axis('off')



    plt.subplot(1, 4, 3)
    plt.title(nombre_imagen_centroide_derecho)
    plt.imshow(imagen_aasa_derecho, cmap='gray')
    plt.axis('off')

    plt.show()


if __name__ == "__main__":
    main()
