import cv2
from matplotlib import pyplot as plt


def aplicar(imagen_hueso_limpia):
    
    #Aplico desenfoques necesarios para detectar circulos. Jugar con esto para lograr precision de deteccion.

    #imagen_hueso_desenfocada = cv2.medianBlur(imagen_hueso_limpia,1)
    imagen_hueso_desenfocada = cv2.GaussianBlur(imagen_hueso_limpia, (7,7),0,0)
    #5.0 - FC30
    #imagen_hueso_desenfocada = cv2.bilateralFilter(imagen_hueso_limpia,10,8000,2)


      # Convertir la imagen desenfocada a negativo
    #imagen_hueso_negativa = 255 - imagen_hueso_desenfocada

    ##Si cambio a TRUE puedo ver como queda la imagen desenfocada.
    if(False):
        plt.figure(figsize=(20, 5))

        plt.subplot(1, 4, 2)
        plt.title('Angulos Sector Acetabular')
        plt.imshow(imagen_hueso_desenfocada, cmap='gray')
        plt.axis('off')
        plt.show()

    return imagen_hueso_desenfocada