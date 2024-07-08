import cv2
from matplotlib import pyplot as plt
import numpy as np
import AngulosSectorAcetabular.aasa as aasa
import AngulosSectorAcetabular.pasa as pasa
import ProcesamientoDicom.ruido as ruido

def calcular(imagen,corte_HU,circulo1,circulo2,lado,radio):


            x,y,r = circulo1
            x_izq,y_izq,_ = circulo2

            #La convierto a blanco y negro y limpio puntos aislados.
            imagen_hueso_blanco_negro=ruido.limpiar(corte_HU)

                ##Si cambio a TRUE puedo ver como queda la imagen desenfocada.
            if(True):
                plt.figure(figsize=(20, 5))

                plt.subplot(1, 4, 2)
                plt.title('Angulos Sector Acetabular')
                plt.imshow(imagen_hueso_blanco_negro, cmap='gray')
                plt.axis('off')
                plt.show()


            # Dibuja la nueva línea con el ángulo deseado (por ejemplo, 90 grados)
            x_final_aasa,y_final_aasa,angulo_aasa = aasa.detectar(imagen_hueso_blanco_negro, x, y, x_izq, y_izq,radio,lado)
            x_final_pasa,y_final_pasa,angulo_pasa = pasa.detectar(imagen_hueso_blanco_negro, x, y, x_izq, y_izq,radio,lado)
            angulo_hasa = abs(angulo_aasa)+abs(angulo_pasa)

            imagen_8bit = cv2.convertScaleAbs(corte_HU)
            imagen_hueso = cv2.cvtColor(imagen_8bit, cv2.COLOR_GRAY2BGR)

            #Dibuja circulo del femur.
            cv2.circle(imagen_hueso, (x, y), r, (255,0, 0), 1)
            #Dibuja Centroide
            cv2.circle(imagen_hueso, (x, y), 2, (255,0, 0), -1)
            #Dibuja centroide opuesto
            cv2.circle(imagen_hueso, (x_izq, y_izq), 2, (255, 0, 0), -1)
            # Dibuja la línea horizontal
            cv2.line(imagen_hueso, (x, y), (x_izq, y_izq), (255, 0, 0), 2)  
             # Dibujar la nueva línea que hace contacto con acetabulo superior (aasa)
            cv2.line(imagen_hueso, (x, y), (x_final_aasa, y_final_aasa), (0, 255, 0), 1)  # Línea verde
             # Dibujar la nueva línea que hace contacto con acetabulo inferior (pasa)
            cv2.line(imagen_hueso, (x, y), (x_final_pasa, y_final_pasa), (0, 255,0), 1)  # Línea verde

            print("")   
            print("Se imprimen los datos del lado: "+lado)
            print("Datos de Cabeza de Femur:")
            print("Componente X: " + str(x))
            print("Componente Y: " + str(y))
            print("Componente Radio: " + str(r))
            print("")
            print("Angulos Sector Acetabular:")
            print("Angulo AASA: " + str(abs(angulo_aasa)) + "°")
            print("Angulo PASA: " + str(abs(angulo_pasa)) + "°")
            print("Angulo HASA: " + str(angulo_hasa) + "°")
            print("----------------------------------------------------------------")


            return imagen_hueso


def calcular_Angulos_Sector_Acetabular(imagen_centroide_izquierdo,nombre_imagen_centroide_izquierdo,corte_HU200_centroide_izquierdo,imagen_centroide_derecho,imagen_original_centroide_derecho,nombre_imagen_centroide_derecho,corte_HU200_centroide_derecho,circulos_izquierdo_max_radio,circulos_derecho_max_radio,max_radio_izquierdo,max_radio_derecho):
          ### Aca calcula los Angulos Sector Acetabular ####
    if imagen_centroide_izquierdo is not None:
        imagen_aasa_izquierdo=calcular(imagen_centroide_izquierdo,corte_HU200_centroide_izquierdo,circulos_izquierdo_max_radio,circulos_derecho_max_radio,"izquierdo",max_radio_izquierdo)
    else:
        print("No se encontro la cabeza del femur izquierdo en ningún archivo.")


    if imagen_centroide_derecho is not None:
            imagen_aasa_derecho=calcular(imagen_original_centroide_derecho,corte_HU200_centroide_derecho,circulos_derecho_max_radio,circulos_izquierdo_max_radio,"derecho",max_radio_derecho)

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