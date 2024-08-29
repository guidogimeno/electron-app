import numpy as np
import cv2
import PreprocesamientoDeCorte.preprocesar as preprocesar
import SectorAcetabular.esContornoCircular as esContornoCircular
import CabezaFemur.cabezaFemurAxial as cabezaFemurAxial

#Detecta el ecuador
def detectar(tomografia_segmentada,tomografia_original):

    radio_maximo_derecho=0
    coordenadas_cabeza_derecha=0,0,0
    numero_corte_ecuador_derecho=0
    contador_sali_de_cabeza_femur_derecho=0
    estoy_en_cabeza_femur_derecho=False

    radio_maximo_izquierdo = 0
    coordenadas_cabeza_izquierda = 0,0,0
    numero_corte_ecuador_izquierdo=0
    contador_sali_de_cabeza_femur_izquierdo=0
    estoy_en_cabeza_femur_izquierdo=False

    tomografia_segmentada = (tomografia_segmentada > 0).astype(np.uint8)

    # Iterar y mostrar cada corte axial desde el ultimo hacia el primero.
    for i in range(tomografia_segmentada.shape[2] - 1, -1, -1):

        if(contador_sali_de_cabeza_femur_derecho==10):
            print("Sali de la cabeza del femur.")
            break

        if(contador_sali_de_cabeza_femur_izquierdo==10):
            print("Sali de la cabeza del femur.")
            break


        #Obtengo corte del archivo segmentado
        femur_derecho_segmentado = tomografia_segmentada[:, :, i,6]
        femur_izquierdo_segmentado = tomografia_segmentada[:, :, i,7]
    
        femur_derecho_segmentado = preprocesar.procesarCorte(femur_derecho_segmentado)
        femur_izquierdo_segmentado = preprocesar.procesarCorte(femur_izquierdo_segmentado)

        # Convertir a escala de grises para la detección de contornos
        femur_derecho_segmentado_gris = cv2.cvtColor(femur_derecho_segmentado, cv2.COLOR_RGB2GRAY)
        femur_izquierdo_segmentado_gris = cv2.cvtColor(femur_izquierdo_segmentado, cv2.COLOR_RGB2GRAY)

        
        #Tratamiento especifico para cada femur
        existe_contorno_circular_derecho,contorno_mas_grande_derecho = esContornoCircular.detectar(femur_derecho_segmentado_gris)
        existe_contorno_circular_izquierdo,contorno_mas_grande_izquierdo = esContornoCircular.detectar(femur_izquierdo_segmentado_gris)


        if existe_contorno_circular_izquierdo:

            flag_cabeza_femur_izquierda,cabeza_izquierda = cabezaFemurAxial.detectar(femur_izquierdo_segmentado,femur_izquierdo_segmentado_gris,contorno_mas_grande_izquierdo,tomografia_original[:, :, i])
            
            
            
            if (flag_cabeza_femur_izquierda):
                _,_,r_izq=cabeza_izquierda
                if( r_izq >= radio_maximo_izquierdo): #Me quedo con la primera aparicion del mas grande o con la ultima?
                    coordenadas_cabeza_izquierda = cabeza_izquierda
                    estoy_en_cabeza_femur_izquierdo=True
                    radio_maximo_izquierdo = r_izq;
                    numero_corte_ecuador_izquierdo = i+1
                    contador_sali_de_cabeza_femur_izquierdo=0

               

                
#            else:
#                print(f"No hallo cabeza de femur en el corte: {i+1}")
        else:
            #print(f"No hallo contorno circular izquierdo en el corte: {i+1}")
            contador_sali_de_cabeza_femur_izquierdo += 1 if estoy_en_cabeza_femur_izquierdo else 0



        if existe_contorno_circular_derecho:

            flag_cabeza_femur,cabeza_derecha = cabezaFemurAxial.detectar(femur_derecho_segmentado,femur_derecho_segmentado_gris,contorno_mas_grande_derecho,tomografia_original[:, :, i])
            

            if (flag_cabeza_femur):
                _,_,r_der=cabeza_derecha
                if(r_der >= radio_maximo_derecho): #Me quedo con la primera aparicion del mas grande o con la ultima?
                    coordenadas_cabeza_derecha= cabeza_derecha
                    estoy_en_cabeza_femur_derecho=True
                    radio_maximo_derecho = r_der;
                    numero_corte_ecuador_derecho= i+1
                    contador_sali_de_cabeza_femur_derecho=0

                """             
                plt.figure(figsize=(18, 10))
                
                plt.subplot(1, 3, 1)
                plt.imshow(corte_original)
                plt.title(f'Imagen Original - Corte Axial {i+1}')
                plt.axis('off')

                plt.subplot(1, 3, 2)
                plt.imshow(corte_segmentado_final)
                plt.title(f'Contorno Más Grande - Corte Axial {i+1}')
                plt.axis('off')

                plt.subplot(1, 3, 3)
                plt.imshow(corte_maximo_radio)
                plt.title(f'Ecuatorial Femur - Corte Axial {numero_corte_maximo_radio}')
                plt.axis('off')

                plt.show() 
                """
           # else:
            #   print(f"No hallo cabeza de femur en el corte: {i+1}")
        else:
           # print(f"No hallo contorno circular en el corte: {i+1}")
            contador_sali_de_cabeza_femur_derecho += 1 if estoy_en_cabeza_femur_derecho else 0


    return coordenadas_cabeza_derecha,numero_corte_ecuador_derecho,coordenadas_cabeza_izquierda,numero_corte_ecuador_izquierdo
