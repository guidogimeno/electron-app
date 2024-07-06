

import cv2
import numpy as np


def limpiar(corte):
    #Con esto limpio la imagen en base a unidades Hounsfield.
    umbral_hueso = 220  # Umbral HU para hueso
    imagen_hueso = np.where(corte >= umbral_hueso, 255, 0).astype(np.uint8)

    #Con esto borro ruido de puntos  blancos.
    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(imagen_hueso, connectivity=8)
    min_size = 500
    imagen_hueso_limpia = np.zeros_like(imagen_hueso)
    for i in range(1, num_labels):
        if stats[i, cv2.CC_STAT_AREA] >= min_size:
            imagen_hueso_limpia[labels == i] = 255

    return imagen_hueso_limpia
