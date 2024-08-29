import numpy as np
import matplotlib.pyplot as plt
import cv2
from CorteProximal import corteProximalAxial
import PreprocesamientoDeCorte.preprocesar as preprocesar
import CorteEcuatorial.corteEcuatorialAxial as corteEcuatorialAxial
import SectorAcetabular.pasa as pasa
import SectorAcetabular.aasa as aasa



def ecuatorial(tomografia_original,tomografia_segmentada):

    
    coordenadas_cabeza_derecha,numero_corte_ecuador_derecho,coordenadas_cabeza_izquierda,numero_corte_ecuador_izquierdo = corteEcuatorialAxial.detectar(tomografia_segmentada,tomografia_original)
        
    #Detecto PASA
    if(numero_corte_ecuador_izquierdo != 0 and numero_corte_ecuador_derecho != 0):


        #Original
        corte_original_acetabulo_izquierdo = tomografia_original[:,:,numero_corte_ecuador_izquierdo]
        corte_original_acetabulo_izquierdo= preprocesar.procesarCorte(corte_original_acetabulo_izquierdo) 
        
        corte_original_acetabulo_derecho = tomografia_original[:,:,numero_corte_ecuador_derecho]
        corte_original_acetabulo_derecho= preprocesar.procesarCorte(corte_original_acetabulo_derecho) 


        #Segmentado
        corte_segmentado_acetabulo_izquierdo = tomografia_segmentada[:,:,numero_corte_ecuador_izquierdo,5]
        corte_segmentado_acetabulo_izquierdo= preprocesar.procesarCorte(corte_segmentado_acetabulo_izquierdo) 

        corte_segmentado_acetabulo_derecho = tomografia_segmentada[:,:,numero_corte_ecuador_derecho,4]
        corte_segmentado_acetabulo_derecho= preprocesar.procesarCorte(corte_segmentado_acetabulo_derecho)   



        # Cortar cada imagen por la mitad
        mitad_derecha_izq = corte_original_acetabulo_izquierdo[:, corte_original_acetabulo_izquierdo.shape[1] // 2:]
        mitad_izquierda_der = corte_original_acetabulo_derecho[:, :corte_original_acetabulo_derecho.shape[1] // 2]


        # Combinar las mitades
        composicion = np.hstack((mitad_izquierda_der, mitad_derecha_izq))

        #Dibujo cabezas
        x_izq,y_izq,r_izq = coordenadas_cabeza_izquierda
        cv2.circle(composicion, (x_izq, y_izq), r_izq, (0, 255, 0), 1)  # Círculo verde
        cv2.circle(composicion, (x_izq, y_izq), 1, (0, 255, 0), 1)  # Círculo verde

        x_der,y_der,r_der = coordenadas_cabeza_derecha
        cv2.circle(composicion, (x_der, y_der), r_der, (0, 255, 0), 1)  # Círculo verde
        cv2.circle(composicion, (x_der, y_der), 1, (0, 255, 0), 1)  # Círculo verde

        # Dibujo la plomada
        cv2.line(composicion, (x_der, y_der), (x_izq, y_izq), (0, 255, 0), 2)  # Línea azul

        #Detecto PASA
        x_pasa_der, y_pasa_der, angulo_pasa_der  = pasa.detectar(corte_segmentado_acetabulo_derecho,x_der,y_der,x_izq,y_izq,r_der,"derecho")
        x_pasa_izq, y_pasa_izq, angulo_pasa_izq  = pasa.detectar(corte_segmentado_acetabulo_izquierdo,x_izq,y_izq,x_der,y_der,r_izq,"izquierdo")
        #Detecto AASA
        x_aasa_der, y_aasa_der, angulo_aasa_der  = aasa.detectar(corte_segmentado_acetabulo_derecho,x_der,y_der,x_izq,y_izq,r_der,"derecho")
        x_aasa_izq, y_aasa_izq, angulo_aasa_izq  = aasa.detectar(corte_segmentado_acetabulo_izquierdo,x_izq,y_izq,x_der,y_der,r_izq,"izquierdo")

        angulo_hasa_izq=angulo_aasa_izq + (angulo_pasa_izq*-1)
        angulo_hasa_der=(angulo_aasa_der*-1) + (angulo_pasa_der)



        cv2.line(composicion, (x_der, y_der), (x_pasa_der, y_pasa_der), (0, 255, 0), 1)  # Línea verd
        cv2.line(composicion, (x_izq, y_izq), (x_pasa_izq, y_pasa_izq), (0, 255, 0), 1)  # Línea verd

        cv2.line(composicion, (x_der, y_der), (x_aasa_der, y_aasa_der), (0, 255, 0), 1)  # Línea verd
        cv2.line(composicion, (x_izq, y_izq), (x_aasa_izq, y_aasa_izq), (0, 255, 0), 1)  # Línea verd


        print("Máximo radio Izquiedo: " + str(r_izq) + 
            "\nCorte: " + str(numero_corte_ecuador_izquierdo)+ 
            "\nPASA Izquierdo: " + str(angulo_pasa_izq) + "°"+
            "\nAASA Izquierdo: " + str(angulo_aasa_izq) + "°"+
                "\nHASA Izquierdo: " + str(angulo_hasa_izq) + "°"+
                "\n------------------------------------------------")
        
        print("\n")

        print("Máximo radio Derecho: " + str(r_der) + 
            "\nCorte: " + str(numero_corte_ecuador_derecho)+
                "\nPASA Derecho: " + str(angulo_pasa_der*-1) + "°"+
                "\nAASA Derecho: " + str(angulo_aasa_der*-1) + "°"+
                "\nHASA Derecho: " + str(angulo_hasa_der) + "°")


        plt.figure(figsize=(18, 10))


        plt.subplot(1, 1, 1)
        plt.imshow(composicion, cmap='gray')
        plt.title('Ecuador Axial')
        plt.axis('off')

        plt.show()  


    else:
        print("No se detecto ambas cabezas de femur.")


def proximal(tomografia_original,tomografia_segmentada):

    
    coordenadas_cabeza_derecha,numero_corte_ecuador_derecho,coordenadas_cabeza_izquierda,numero_corte_ecuador_izquierdo = corteProximalAxial.detectar(tomografia_segmentada,tomografia_original)
        
    #Detecto PASA
    if(numero_corte_ecuador_izquierdo != 0 and numero_corte_ecuador_derecho != 0):


        #Original
        corte_original_acetabulo_izquierdo = tomografia_original[:,:,numero_corte_ecuador_izquierdo]
        corte_original_acetabulo_izquierdo= preprocesar.procesarCorte(corte_original_acetabulo_izquierdo) 
        
        corte_original_acetabulo_derecho = tomografia_original[:,:,numero_corte_ecuador_derecho]
        corte_original_acetabulo_derecho= preprocesar.procesarCorte(corte_original_acetabulo_derecho) 


        #Segmentado
        corte_segmentado_acetabulo_izquierdo = tomografia_segmentada[:,:,numero_corte_ecuador_izquierdo,5]
        corte_segmentado_acetabulo_izquierdo= preprocesar.procesarCorte(corte_segmentado_acetabulo_izquierdo) 

        corte_segmentado_acetabulo_derecho = tomografia_segmentada[:,:,numero_corte_ecuador_derecho,4]
        corte_segmentado_acetabulo_derecho= preprocesar.procesarCorte(corte_segmentado_acetabulo_derecho)   



        # Cortar cada imagen por la mitad
        mitad_derecha_izq = corte_original_acetabulo_izquierdo[:, corte_original_acetabulo_izquierdo.shape[1] // 2:]
        mitad_izquierda_der = corte_original_acetabulo_derecho[:, :corte_original_acetabulo_derecho.shape[1] // 2]


        # Combinar las mitades
        composicion = np.hstack((mitad_izquierda_der, mitad_derecha_izq))

        #Dibujo cabezas
        x_izq,y_izq,r_izq = coordenadas_cabeza_izquierda
        cv2.circle(composicion, (x_izq, y_izq), r_izq, (0, 255, 0), 1)  # Círculo verde
        cv2.circle(composicion, (x_izq, y_izq), 1, (0, 255, 0), 1)  # Círculo verde

        x_der,y_der,r_der = coordenadas_cabeza_derecha
        cv2.circle(composicion, (x_der, y_der), r_der, (0, 255, 0), 1)  # Círculo verde
        cv2.circle(composicion, (x_der, y_der), 1, (0, 255, 0), 1)  # Círculo verde

        # Dibujo la plomada
        cv2.line(composicion, (x_der, y_der), (x_izq, y_izq), (0, 255, 0), 2)  # Línea azul

        #Detecto PASA
        x_pasa_der, y_pasa_der, angulo_pasa_der  = pasa.detectar(corte_segmentado_acetabulo_derecho,x_der,y_der,x_izq,y_izq,r_der,"derecho")
        x_pasa_izq, y_pasa_izq, angulo_pasa_izq  = pasa.detectar(corte_segmentado_acetabulo_izquierdo,x_izq,y_izq,x_der,y_der,r_izq,"izquierdo")
        #Detecto AASA
        x_aasa_der, y_aasa_der, angulo_aasa_der  = aasa.detectar(corte_segmentado_acetabulo_derecho,x_der,y_der,x_izq,y_izq,r_der,"derecho")
        x_aasa_izq, y_aasa_izq, angulo_aasa_izq  = aasa.detectar(corte_segmentado_acetabulo_izquierdo,x_izq,y_izq,x_der,y_der,r_izq,"izquierdo")

        angulo_hasa_izq=angulo_aasa_izq + (angulo_pasa_izq*-1)
        angulo_hasa_der=(angulo_aasa_der*-1) + (angulo_pasa_der)



        cv2.line(composicion, (x_der, y_der), (x_pasa_der, y_pasa_der), (0, 255, 0), 1)  # Línea verd
        cv2.line(composicion, (x_izq, y_izq), (x_pasa_izq, y_pasa_izq), (0, 255, 0), 1)  # Línea verd

        cv2.line(composicion, (x_der, y_der), (x_aasa_der, y_aasa_der), (0, 255, 0), 1)  # Línea verd
        cv2.line(composicion, (x_izq, y_izq), (x_aasa_izq, y_aasa_izq), (0, 255, 0), 1)  # Línea verd


        print("Máximo radio Izquiedo: " + str(r_izq) + 
        "\nCorte: " + str(numero_corte_ecuador_izquierdo)+ 
        "\nPASA Izquierdo: " + str(angulo_pasa_izq) + "°"+
        "\nAASA Izquierdo: " + str(angulo_aasa_izq) + "°"+
        "\nHASA Izquierdo: " + str(angulo_hasa_izq) + "°"+
        "\n------------------------------------------------")
        
        print("\n")

        print("Máximo radio Derecho: " + str(r_der) + 
            "\nCorte: " + str(numero_corte_ecuador_derecho)+
                "\nPASA Derecho: " + str(angulo_pasa_der*-1) + "°"+
                "\nAASA Derecho: " + str(angulo_aasa_der*-1) + "°"+
                "\nHASA Derecho: " + str(angulo_hasa_der) + "°")


        plt.figure(figsize=(18, 10))


        plt.subplot(1, 1, 1)
        plt.imshow(composicion, cmap='gray')
        plt.title('Proximal Axial')
        plt.axis('off')

        plt.show()  


    else:
        print("No se detecto ambas cabezas de femur.")

    return r_izq,numero_corte_ecuador_izquierdo,angulo_pasa_izq,angulo_aasa_izq,angulo_hasa_izq,r_der,numero_corte_ecuador_derecho,angulo_pasa_der,angulo_aasa_der,angulo_hasa_der,composicion




def detectar(tomografia_original,tomografia_segmentada):
    #ecuatorial(tomografia_original,tomografia_segmentada)
    proximal(tomografia_original,tomografia_segmentada)




  


