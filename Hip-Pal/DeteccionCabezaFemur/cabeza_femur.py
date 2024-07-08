
import cv2
from matplotlib import pyplot as plt
import numpy as np


def detectarPosibleCabeza(corte_desenfocado):
    #Detecto cada femur en la imagen por separado.
    #Parto la imagen en 2 para evaluar femur derecho e izquierdo por separado.

    mitad_imagen= corte_desenfocado.shape[1] // 2
    mitad_imagen_derecha = corte_desenfocado[:, mitad_imagen:]
    mitad_imagen_izquierda = corte_desenfocado[:,:mitad_imagen]
    cabeza_femur_derecho =identificar(mitad_imagen_derecha)
    cabeza_femur_izquierdo =identificar(mitad_imagen_izquierda)

    return cabeza_femur_derecho,cabeza_femur_izquierdo


def identificar(mitad_imagen):
    cabeza_femur= cv2.HoughCircles(mitad_imagen, cv2.HOUGH_GRADIENT, dp=1, minDist=100, param1=100, param2=55, minRadius=0, maxRadius=50)
    if cabeza_femur is not None:
        cabeza_femur = np.round(cabeza_femur[0, :]).astype("int")
        return cabeza_femur[0]  # Retorna el primer círculo del array
