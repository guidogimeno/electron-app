import os
import pydicom
import numpy as np
import cv2
import DeteccionCabezaFemur.cabeza_femur as cabeza_femur
import ProcesamientoDicom.desenfoque as desenfoque
import ProcesamientoDicom.ruido as ruido



#Aca es donde se aplican los filtros a cada corte. Blur, HU>200, etc....
def procesar_archivo(ruta_archivo_dicom):

    #Procesa un archivo DICOM y devuelve información relevante sobre los círculos encontrados.
    corte = pydicom.dcmread(ruta_archivo_dicom)
    corte_original = corte.pixel_array
    nombre_corte = os.path.basename(corte.filename)

    rescale_intercept = corte.RescaleIntercept if 'RescaleIntercept' in corte else 0
    rescale_slope = corte.RescaleSlope if 'RescaleSlope' in corte else 1
    imagen_hu = corte_original * rescale_slope + rescale_intercept
    
    #ACA ARRANCA LO IMPORTANTE----------------------------------------------------------------
    #Saco el ruido
    corte_sin_ruido = ruido.limpiar(imagen_hu)

    #Aplicamos desenfoque para facilitar la deteccion de angulos.
    corte_desenfocado=desenfoque.aplicar(corte_sin_ruido)

    
    #Parto la imagen en 2 para evaluar femur derecho e izquierdo por separado.
    mitad_imagen= corte_desenfocado.shape[1] // 2
    mitad_imagen_derecha = corte_desenfocado[:, mitad_imagen:]
    mitad_imagen_izquierda = corte_desenfocado[:,:mitad_imagen]
    
    #Detecto cada femur en la imagen por separado.
    cabeza_femur_derecho =cabeza_femur.identificar(mitad_imagen_derecha)
    cabeza_femur_izquierdo =cabeza_femur.identificar(mitad_imagen_izquierda)

    return cabeza_femur_derecho,cabeza_femur_izquierdo, corte_original, nombre_corte, corte_sin_ruido, corte_desenfocado
