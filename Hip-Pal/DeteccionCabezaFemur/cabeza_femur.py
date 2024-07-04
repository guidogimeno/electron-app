
import cv2
import numpy as np



def identificar(mitad_imagen):
    cabeza_femur= cv2.HoughCircles(mitad_imagen, cv2.HOUGH_GRADIENT, dp=1, minDist=100, param1=1, param2=55, minRadius=0, maxRadius=50)
    if cabeza_femur is not None:
        cabeza_femur = np.round(cabeza_femur[0, :]).astype("int")
        return cabeza_femur[0]  # Retorna el primer círculo del array
