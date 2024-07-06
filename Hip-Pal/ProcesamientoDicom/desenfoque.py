import cv2


def aplicar(imagen_hueso_limpia):
    
    #Aplico desenfoques necesarios para detectar circulos. Jugar con esto para lograr precision de deteccion.

    #imagen_hueso_desenfocada = cv2.medianBlur(imagen_hueso_limpia, 1)
    #imagen_hueso_desenfocada = cv2.GaussianBlur(imagen_hueso_limpia, (9,9),0)
    imagen_hueso_desenfocada = cv2.bilateralFilter(imagen_hueso_limpia,10,8000,2)

    return imagen_hueso_desenfocada