import os
import pydicom
import numpy as np
import cv2
import matplotlib.pyplot as plt
import DeteccionCabezaFemur.cabeza_femur as cabeza_femur
import AngulosSectorAcetabular.angulos_Sector_Actabular as angulos_Sector_Actabular


#Aca es donde se aplican los filtros a cada corte. Blur, HU>200, etc....
def procesar_archivo_dicom(ruta_archivo_dicom):

    #Procesa un archivo DICOM y devuelve información relevante sobre los círculos encontrados.
    corte = pydicom.dcmread(ruta_archivo_dicom)
    imagen = corte.pixel_array
    nombre_archivo = os.path.basename(corte.filename)

    rescale_intercept = corte.RescaleIntercept if 'RescaleIntercept' in corte else 0
    rescale_slope = corte.RescaleSlope if 'RescaleSlope' in corte else 1
    imagen_hu = imagen * rescale_slope + rescale_intercept

    #Con esto limpio la imagen en base a unidades Hounsfield.
    umbral_hueso = 220  # Umbral HU para hueso
    imagen_hueso = np.where(imagen_hu >= umbral_hueso, 255, 0).astype(np.uint8)

    #Con esto borro ruido de puntos  blancos.
    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(imagen_hueso, connectivity=8)
    min_size = 500
    imagen_hueso_limpia = np.zeros_like(imagen_hueso)
    for i in range(1, num_labels):
        if stats[i, cv2.CC_STAT_AREA] >= min_size:
            imagen_hueso_limpia[labels == i] = 255

    #Aplico desenfoques necesarios para detectar circulos
    #imagen_hueso_desenfocada = cv2.medianBlur(imagen_hueso_limpia, 1)
    #imagen_hueso_desenfocada = cv2.GaussianBlur(imagen_hueso_limpia, (5,5),0)
    imagen_hueso_desenfocada = cv2.bilateralFilter(imagen_hueso_limpia,10,8000,2)
    
    #Parto la imagen en 2 para evaluar femur derecho e izquierdo por separado.
    mitad_imagen= imagen_hueso_desenfocada.shape[1] // 2
    mitad_imagen_derecha = imagen_hueso_desenfocada[:, mitad_imagen:]
    mitad_imagen_izquierda = imagen_hueso_desenfocada[:,:mitad_imagen]
    
    #Detecto cada femur en la imagen por separado.
    cabeza_femur_derecho =cabeza_femur.identificar(mitad_imagen_derecha)
    cabeza_femur_izquierdo =cabeza_femur.identificar(mitad_imagen_izquierda)

    return cabeza_femur_derecho,cabeza_femur_izquierdo, imagen, nombre_archivo, imagen_hueso_limpia, imagen_hueso_desenfocada



def main():
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
            cabeza_femur_derecho,cabeza_femur_izquierdo, imagen, nombre_archivo, imagen_hueso_limpia, imagen_hueso_desenfocada = procesar_archivo_dicom(ruta_archivo_dicom)
            
            #Logica para guardar el mayor circulo izquierdo.
            if cabeza_femur_izquierdo is not None:
                x,y,r=cabeza_femur_izquierdo
                if r > max_radio_izquierdo:
                    max_radio_izquierdo=r
                    imagen_centroide_izquierdo = imagen
                    nombre_imagen_centroide_izquierdo = nombre_archivo
                    imagen_original_centroide_izquierdo = imagen
                    corte_HU200_centroide_izquierdo = imagen_hueso_limpia
                    #corte_derecho_desenfocado = imagen_hueso_desenfocada
                    circulos_izquierdo_max_radio = x,y,r
                    #circulos_derecho_max_radio = x + imagen_hueso_desenfocada.shape[1] // 2,y,r

            #Lógica para guardar el mayor circulo derecho.
            if cabeza_femur_derecho is not None:

                x,y,r=cabeza_femur_derecho
                #Correccion dado que cortamos la imagen en 2 para detectar los circulos.
                x,y,r = x + imagen_hueso_desenfocada.shape[1] // 2, y, r

                #Si el radio del circulo actual es mayor al historico me lo guardo.
                if r > max_radio_derecho:
                    max_radio_derecho = r
                    imagen_centroide_derecho = imagen
                    nombre_imagen_centroide_derecho = nombre_archivo
                    imagen_original_centroide_derecho = imagen
                    corte_HU200_centroide_derecho = imagen_hueso_limpia
                    corte_derecho_desenfocado = imagen_hueso_desenfocada
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
