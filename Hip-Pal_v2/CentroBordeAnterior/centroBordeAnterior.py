import numpy as np
from CentroBordeAnterior.Utils import esCorteEcuatorialSagital
from PreprocesamientoDeCorte import  preprocesarSagital, preprocesarSagitalSegmentado
from matplotlib import pyplot as plt
import cv2
from SectorAcetabular.Angulos import aasa

def graficar(id, base_path,corte_ecuatorial_sagital,x,y,punto_inicio,punto_fin,x_final,y_final,lado):

    cv2.circle(corte_ecuatorial_sagital, (x, y), 1, (0, 255, 0), 2)  # Punto verde en (x_opuesto, y_opuesto)
    # Dibujar la línea en la imagen segmentada
    cv2.line(corte_ecuatorial_sagital, punto_inicio, punto_fin, (0, 255, 0), 1)  # Línea azul de grosor 2

    cv2.line(corte_ecuatorial_sagital, (x, y), (x_final, y_final), (0, 255, 0), 1)

    #Guardamos la imagen sin título ni ejes
    plt.figure(figsize=(10, 7))
    plt.imshow(corte_ecuatorial_sagital, cmap="gray", aspect='auto')
    plt.axis('off')  # Desactiva los ejes
    output_path = f"{base_path}/temp-reports/{id}/CentroBordeAnterior{lado}.png"
    plt.savefig(output_path, bbox_inches='tight', pad_inches=0)
    return output_path.replace("temp-reports", "reports")


def detectar(id, base_path,cabezas_femur_axiales,tomografia_original,tomografia_segmentada):
    tomografia_segmentada_invertida = tomografia_segmentada
    longitud_recta = 100

    # Coordenadas del centro del círculo en la vista axial izq
    coordenadas_izq = cabezas_femur_axiales["ecuatorial"]["izquierdo"]["coordenadas"]
    numero_corte_izq=cabezas_femur_axiales["ecuatorial"]["izquierdo"]["numero_corte"]
    x_izq,y_izq,z_izq=esCorteEcuatorialSagital.obtenerCentroide(tomografia_original,coordenadas_izq,numero_corte_izq)
    corte_ecuatorial_sagital_izq = tomografia_original[z_izq,:,:]
    corte_ecuatorial_sagital_izq= preprocesarSagital.procesarCorte(corte_ecuatorial_sagital_izq)
    sagital_slice_izq_segmentado=tomografia_segmentada_invertida[z_izq,:,:,5]
    sagital_slice_izq_segmentado= preprocesarSagitalSegmentado.procesarCorte(sagital_slice_izq_segmentado)
    #Uso lado derecho en ambas ocaciones por como rota el angulo.
    x_final_izq, y_final_izq, angulo_CBA_izq,_=aasa.detectar(sagital_slice_izq_segmentado,x_izq,y_izq,x_izq,y_izq,1,"derecho")
    # Definir la longitud de la recta (en este caso 100 píxeles)

    # Calcular las coordenadas de inicio y fin de la recta
    # La línea será perpendicular al plano del piso (vertical), por lo que modificamos solo las coordenadas `y`
    punto_inicio = (x_izq, y_izq)
    punto_fin = (x_izq, y_izq - longitud_recta)  # Restamos en y para que la línea sea hacia arriba
    angulo_CBA_izq=(-1*angulo_CBA_izq)-90
    output_path_izq=graficar(id, base_path,corte_ecuatorial_sagital_izq,x_izq,y_izq,punto_inicio,punto_fin,x_final_izq,y_final_izq,"Izquierdo")


    # Coordenadas del centro del círculo en la vista derecho
    coordenadas_der = cabezas_femur_axiales["ecuatorial"]["derecho"]["coordenadas"]
    numero_corte_der=cabezas_femur_axiales["ecuatorial"]["derecho"]["numero_corte"]
    x_der,y_der,z_der=esCorteEcuatorialSagital.obtenerCentroide(tomografia_original,coordenadas_der,numero_corte_der)
    corte_ecuatorial_sagital_der = tomografia_original[z_der,:,:]
    corte_ecuatorial_sagital_der= preprocesarSagital.procesarCorte(corte_ecuatorial_sagital_der)
    sagital_slice_der_segmentado=tomografia_segmentada_invertida[z_der,:,:,4]
    sagital_slice_der_segmentado= preprocesarSagitalSegmentado.procesarCorte(sagital_slice_der_segmentado)
    x_final_der, y_final_der, angulo_CBA_der,_=aasa.detectar(sagital_slice_der_segmentado,x_der,y_der,x_der,y_der,1,"derecho")
    # Definir la longitud de la recta (en este caso 100 píxeles)
    # Calcular las coordenadas de inicio y fin de la recta
    # La línea será perpendicular al plano del piso (vertical), por lo que modificamos solo las coordenadas `y`
    punto_inicio = (x_der, y_der)
    punto_fin = (x_der, y_der - longitud_recta)  # Restamos en y para que la línea sea hacia arriba
    angulo_CBA_der=(-1*angulo_CBA_der)-90
    output_path_der=graficar(id, base_path,corte_ecuatorial_sagital_der,x_der,y_der,punto_inicio,punto_fin,x_final_der,y_final_der,"Derecho")



    angulos_CBA= [
            {
                "name": "Izquierdo",
                "path":output_path_izq,
                "izquierdo":[{
                    "name":"CBA",
                    "value":angulo_CBA_izq,
                    "valorNormal": "25° a 39°"
                }]
            },
            {
                "name": "Derecho",
                "path":output_path_der,
                "derecho":[{
                    "name":"CBA",
                    "value":angulo_CBA_der,
                    "valorNormal": "25° a 39°"
                }]
                
            }
    ]


    return angulos_CBA
