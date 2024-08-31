import cv2
import PreprocesamientoDeCorte.preprocesar as preprocesar
from SectorAcetabular.Utils import esCorteEcuatorialAxial
from SectorAcetabular.Utils import esCorteProximalAxial 



def detectar(tomografia_segmentada):

    encontre_ecuatorial_derecho=False
    cabeza_ecuatorial_der=None
    corte_cabeza_ecuatorial_der=0
    radio_cabeza_ecuatorial_der=0
    sali_cabeza_ecuatorial_der=0

    encontre_ecuatorial_izquierdo=False
    cabeza_ecuatorial_izq=None
    corte_cabeza_ecuatorial_izq=0
    radio_cabeza_ecuatorial_izq=0
    sali_cabeza_ecuatorial_izq=0


    encontre_proximal_izquierdo=False
    cabeza_proximal_izq=None
    corte_cabeza_proximal_izq=0

    encontre_proximal_derecho=False
    cabeza_proximal_der=None
    corte_cabeza_proximal_der=0


    #Deteccion
    for i in range(tomografia_segmentada.shape[2] - 1, -1, -1):

        #Obtengo corte del archivo segmentado
        femur_derecho_segmentado = tomografia_segmentada[:, :, i,6]
        femur_izquierdo_segmentado = tomografia_segmentada[:, :, i,7]
    
        femur_derecho_segmentado = preprocesar.procesarCorte(femur_derecho_segmentado)
        femur_izquierdo_segmentado = preprocesar.procesarCorte(femur_izquierdo_segmentado)

        # Convertir a escala de grises para la detección de contornos
        femur_derecho_segmentado_gris = cv2.cvtColor(femur_derecho_segmentado, cv2.COLOR_RGB2GRAY)
        femur_izquierdo_segmentado_gris = cv2.cvtColor(femur_izquierdo_segmentado, cv2.COLOR_RGB2GRAY)
        
        if(sali_cabeza_ecuatorial_der==10):
            encontre_ecuatorial_derecho=True


        if not encontre_ecuatorial_derecho:
            coordenadas,flag_contorno,flag_cabeza = esCorteEcuatorialAxial.detectar(femur_derecho_segmentado,femur_derecho_segmentado_gris,radio_cabeza_ecuatorial_der)
            
            if (not flag_contorno and radio_cabeza_ecuatorial_der != 0):
                sali_cabeza_ecuatorial_der+=1

            if(flag_cabeza):
                _,_,r_cabeza_ecuatorial_der_hallada=coordenadas
                cabeza_ecuatorial_der=coordenadas
                corte_cabeza_ecuatorial_der=i
                radio_cabeza_ecuatorial_der=r_cabeza_ecuatorial_der_hallada


        if not encontre_proximal_derecho:
            coordenadas_proximal,flag_cabeza = esCorteProximalAxial.detectar(femur_derecho_segmentado,femur_derecho_segmentado_gris)
            if(flag_cabeza):
                cabeza_proximal_der=coordenadas_proximal
                corte_cabeza_proximal_der=i
                encontre_proximal_derecho=True




        if(sali_cabeza_ecuatorial_izq==10):
            encontre_ecuatorial_izquierdo=True


        if not encontre_ecuatorial_izquierdo:
            coordenadas,flag_contorno,flag_cabeza = esCorteEcuatorialAxial.detectar(femur_izquierdo_segmentado,femur_izquierdo_segmentado_gris,radio_cabeza_ecuatorial_izq)
            
            if (not flag_contorno and radio_cabeza_ecuatorial_izq != 0):
                sali_cabeza_ecuatorial_izq+=1

            if(flag_cabeza):
                _,_,r_cabeza_ecuatorial_izq_hallada=coordenadas
                cabeza_ecuatorial_izq=coordenadas
                corte_cabeza_ecuatorial_izq=i
                radio_cabeza_ecuatorial_izq=r_cabeza_ecuatorial_izq_hallada


        if not encontre_proximal_izquierdo:
            coordenadas_proximal,flag_cabeza = esCorteProximalAxial.detectar(femur_izquierdo_segmentado,femur_izquierdo_segmentado_gris)
            if(flag_cabeza):
                cabeza_proximal_izq=coordenadas_proximal
                corte_cabeza_proximal_izq=i
                encontre_proximal_izquierdo=True



    if(encontre_ecuatorial_izquierdo and encontre_ecuatorial_derecho and encontre_proximal_derecho and encontre_proximal_izquierdo):

        #Armo resultados

        femurs={
            "proximal":{
                "izquierdo":{
                    "coordenadas":cabeza_proximal_izq,
                    "numero_corte":corte_cabeza_proximal_izq,
                },
                "derecho":{
                    "coordenadas":cabeza_proximal_der,
                    "numero_corte":corte_cabeza_proximal_der,
                }
            },
            "ecuatorial":{
                "izquierdo":{
                    "coordenadas":cabeza_ecuatorial_izq,
                    "numero_corte":corte_cabeza_ecuatorial_izq,
                },
                "derecho":{
                    "coordenadas":cabeza_ecuatorial_der,
                    "numero_corte":corte_cabeza_ecuatorial_der,
                }
            }
        }

        return femurs
    
    else:
        print("No encontre el ecuatorial de una o de ambas cabezas.")

