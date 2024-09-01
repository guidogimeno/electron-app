import numpy as np
import cv2




#Detecta contornos circulares para acercarnos a la cabeza del femur
def detectar(corte_segmentado,min_value):
    #Flag de que hallo contorno
    existe_contorno_circular=False;

    # Detectar contornos
    contours, _ = cv2.findContours(corte_segmentado, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE);
    

    if contours:
        # Encontrar el contorno con el área más grande
        contorno_mas_grande = max(contours, key=cv2.contourArea)

        # Calcular el área y el perímetro del contorno más grande
        area = cv2.contourArea(contorno_mas_grande)
        perimetro = cv2.arcLength(contorno_mas_grande, True)
        
        #Evitar división por cero
        if perimetro > 0:
            # Calcular la circularidad
            circularidad = (4 * np.pi * area) / (perimetro ** 2)
           
            # Verificar si el contorno es suficientemente circular
            if min_value <= circularidad <= 1:  # Puedes ajustar los umbrales según sea necesario
                existe_contorno_circular = True
            else:
                existe_contorno_circular = False
                
        return existe_contorno_circular,contorno_mas_grande
    else:
        return existe_contorno_circular,0
