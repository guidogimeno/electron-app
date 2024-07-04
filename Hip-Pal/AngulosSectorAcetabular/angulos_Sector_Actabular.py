import cv2
import numpy as np
import AngulosSectorAcetabular.aasa as aasa
import AngulosSectorAcetabular.pasa as pasa


def detectar(imagen,nombre_imagen,corte_HU,circulo1,circulo2,lado,radio):
            imagen_8bit = cv2.convertScaleAbs(corte_HU)
            imagen_hueso = cv2.cvtColor(imagen_8bit, cv2.COLOR_GRAY2BGR)
            x,y,r = circulo1
            x_izq,y_izq,_ = circulo2

            # Crear una máscara del mismo tamaño que la imagen y llenarla de ceros (negro)
            mask = np.zeros(imagen_hueso.shape[:2], dtype=np.uint8)
            
            # Dibujar un círculo blanco (valor 255) en la máscara en la posición del círculo detectado
            cv2.circle(mask, (x, y), r, 255, -1)
            
            # Invertir la máscara para que el círculo sea negro y el resto sea blanco
            mask_inv = cv2.bitwise_not(mask)
            
            # Aplicar la máscara invertida a la imagen original
            imagen_resultado = cv2.bitwise_and(imagen_hueso, imagen_hueso, mask=mask_inv)
            


            # Dibuja la nueva línea con el ángulo deseado (por ejemplo, 90 grados)
            x_final_aasa,y_final_aasa,angulo_aasa = aasa.detectar(imagen_resultado, x, y, x_izq, y_izq,radio,lado)
            x_final_pasa,y_final_pasa,angulo_pasa = pasa.detectar(imagen_resultado, x, y, x_izq, y_izq,radio,lado)
            angulo_hasa = abs(angulo_aasa)+abs(angulo_pasa)

            #imagen_original_centroide= cv2.convertScaleAbs(imagen_resultado)
            #imagen_original_centroide = cv2.cvtColor(imagen_original_centroide, cv2.COLOR_GRAY2BGR)

            #Dibuja circulo del femur.
            cv2.circle(imagen_resultado, (x, y), r, (255,0, 0), 1)
            #Dibuja Centroide
            cv2.circle(imagen_resultado, (x, y), 2, (255,0, 0), -1)
            #Dibuja centroide opuesto
            cv2.circle(imagen_resultado, (x_izq, y_izq), 2, (255, 0, 0), -1)
            # Dibuja la línea horizontal
            cv2.line(imagen_resultado, (x, y), (x_izq, y_izq), (255, 0, 0), 2)  
             # Dibujar la nueva línea que hace contacto con acetabulo superior (aasa)
            cv2.line(imagen_resultado, (x, y), (x_final_aasa, y_final_aasa), (0, 255, 0), 1)  # Línea verde
             # Dibujar la nueva línea que hace contacto con acetabulo inferior (pasa)
            cv2.line(imagen_resultado, (x, y), (x_final_pasa, y_final_pasa), (0, 255,0), 1)  # Línea verde

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
            return imagen_resultado
