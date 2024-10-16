import cv2
from matplotlib import pyplot as plt
import numpy as np
from Excepciones.Excepciones import ErrorDetectandoAngulos
from PreprocesamientoDeCorte import preprocesarAxialOriginal, preprocesarAxialSegmentado
from SectorAcetabular.Angulos import aasa, pasa


def detectar(id, base_path, json, tomografia_original, tomografia_segmentada):

    try:

        angulos_proximal = calcularAngulos(tomografia_segmentada, json["proximal"]["izquierdo"]["coordenadas"], json["proximal"]
                                           ["derecho"]["coordenadas"], json["proximal"]["izquierdo"]["numero_corte"], json["proximal"]["derecho"]["numero_corte"])
        composicion_proximal = obtenerCorteCombinado(
            tomografia_original, tomografia_segmentada, json["proximal"]["izquierdo"]["numero_corte"], json["proximal"]["derecho"]["numero_corte"])
        path_proximal = graficar(id, base_path, composicion_proximal, json["proximal"]["izquierdo"]["coordenadas"],
                                 json["proximal"]["derecho"]["coordenadas"], angulos_proximal, "EcuadorProximal")

        angulos_intermedial = calcularAngulos(tomografia_segmentada, json["intermedial"]["izquierdo"]["coordenadas"], json["intermedial"]
                                              ["derecho"]["coordenadas"], json["intermedial"]["izquierdo"]["numero_corte"], json["intermedial"]["derecho"]["numero_corte"])
        composicion_intermedial = obtenerCorteCombinado(
            tomografia_original, tomografia_segmentada, json["intermedial"]["izquierdo"]["numero_corte"], json["intermedial"]["derecho"]["numero_corte"])
        path_intermedial = graficar(id, base_path, composicion_intermedial, json["intermedial"]["izquierdo"]["coordenadas"],
                                    json["intermedial"]["derecho"]["coordenadas"], angulos_intermedial, "IntermedialAxial")

        angulos_ecuatorial = calcularAngulos(tomografia_segmentada, json["ecuatorial"]["izquierdo"]["coordenadas"], json["ecuatorial"]
                                             ["derecho"]["coordenadas"], json["ecuatorial"]["izquierdo"]["numero_corte"], json["ecuatorial"]["derecho"]["numero_corte"])
        composicion_ecuatorial = obtenerCorteCombinado(
            tomografia_original, tomografia_segmentada, json["ecuatorial"]["izquierdo"]["numero_corte"], json["ecuatorial"]["derecho"]["numero_corte"])
        path_ecuatorial = graficar(id, base_path, composicion_ecuatorial, json["ecuatorial"]["izquierdo"]["coordenadas"],
                                   json["ecuatorial"]["derecho"]["coordenadas"], angulos_ecuatorial, "EcuadorAxial")

        angulos = [
            {
                "name": "Proximal",
                "path": path_proximal,
                "izquierdo": [
                    {
                        "name": "AASA",
                        "value":  angulos_proximal["izquierdo"]["aasa"],
                        "valorLimite": "120.9°"
                    },
                    {
                        "name": "PASA",
                        "value":  angulos_proximal["izquierdo"]["pasa"],
                        "valorLimite": "120.5°"                 
                    },
                    {
                        "name": "HASA",
                        "value":  angulos_proximal["izquierdo"]["hasa"],
                        "valorLimite": "241.4°"  
                    }
                ],
                "derecho": [
                    {
                        "name": "AASA",
                        "value":  angulos_proximal["derecho"]["aasa"],
                        "valorLimite": "120.9°"
                    },
                    {
                        "name": "PASA",
                        "value":  angulos_proximal["derecho"]["pasa"],
                        "valorLimite": "120.5°"   
                    },
                    {
                        "name": "HASA",
                        "value":  angulos_proximal["derecho"]["hasa"],
                        "valorLimite": "241.4°" 
                    }
                ]
            },
            {
                "name": "Intermedial",
                "path": path_intermedial,
                "izquierdo": [
                    {
                        "name": "AASA",
                        "value":  angulos_intermedial["izquierdo"]["aasa"],
                        "valorLimite": "67.7°" 
                    },
                    {
                        "name": "PASA",
                        "value":  angulos_intermedial["izquierdo"]["pasa"],
                        "valorLimite": "101.5°" 
                    },
                    {
                        "name": "HASA",
                        "value":  angulos_intermedial["izquierdo"]["hasa"],
                        "valorLimite": "169.2°" 
                    }
                ],
                "derecho": [
                    {
                        "name": "AASA",
                        "value":  angulos_intermedial["derecho"]["aasa"],
                        "valorLimite": "67.7°" 
                    },
                    {
                        "name": "PASA",
                        "value":  angulos_intermedial["derecho"]["pasa"],
                        "valorLimite": "101.5°" 
                    },
                    {
                        "name": "HASA",
                        "value":  angulos_intermedial["derecho"]["hasa"],
                        "valorLimite": "169.2°" 
                    }
                ]
            },
            {
                "name": "Ecuatorial",
                "path": path_ecuatorial,
                "izquierdo": [
                    {
                        "name": "AASA",
                        "value":  angulos_ecuatorial["izquierdo"]["aasa"],
                        "valorLimite": "50.3°" 
                    },
                    {
                        "name": "PASA",
                        "value":  angulos_ecuatorial["izquierdo"]["pasa"],
                        "valorLimite": "91.4°" 
                    },
                    {
                        "name": "HASA",
                        "value":  angulos_ecuatorial["izquierdo"]["hasa"],
                        "valorLimite": "141.7°" 
                    }
                ],
                "derecho": [
                    {
                        "name": "AASA",
                        "value":  angulos_ecuatorial["derecho"]["aasa"],
                        "valorLimite": "50.3°" 
                    },
                    {
                        "name": "PASA",
                        "value":  angulos_ecuatorial["derecho"]["pasa"],
                        "valorLimite": "91.4°" 
                    },
                    {
                        "name": "HASA",
                        "value":  angulos_ecuatorial["derecho"]["hasa"],
                        "valorLimite": "141.7°" 
                    }
                ]
            }
        ]

        return angulos

    except Exception as e:
        raise ErrorDetectandoAngulos(e)


def obtenerCorteCombinado(tomografia_original, tomografia_segmentada, numero_corte_izquierdo, numero_corte_derecho):

    # Original
    corte_original_acetabulo_izquierdo = tomografia_original[:,
                                                             :, numero_corte_izquierdo]
    corte_original_acetabulo_izquierdo = preprocesarAxialOriginal.procesarCorte(
        corte_original_acetabulo_izquierdo)

    corte_original_acetabulo_derecho = tomografia_original[:,
                                                           :, numero_corte_derecho]
    corte_original_acetabulo_derecho = preprocesarAxialOriginal.procesarCorte(
        corte_original_acetabulo_derecho)

    # Segmentado
    corte_segmentado_acetabulo_izquierdo = tomografia_segmentada[:,
                                                                 :, numero_corte_izquierdo, 5]
    corte_segmentado_acetabulo_izquierdo = preprocesarAxialSegmentado.procesarCorte(
        corte_segmentado_acetabulo_izquierdo)

    corte_segmentado_acetabulo_derecho = tomografia_segmentada[:,
                                                               :, numero_corte_derecho, 4]
    corte_segmentado_acetabulo_derecho = preprocesarAxialSegmentado.procesarCorte(
        corte_segmentado_acetabulo_derecho)

    # Cortar cada imagen por la mitad
    mitad_derecha_izq = corte_original_acetabulo_izquierdo[:,
                                                           corte_original_acetabulo_izquierdo.shape[1] // 2:]
    mitad_izquierda_der = corte_original_acetabulo_derecho[:,
                                                           :corte_original_acetabulo_derecho.shape[1] // 2]

    # Combinar las mitades
    composicion = np.hstack((mitad_izquierda_der, mitad_derecha_izq))

    return composicion


def calcularAngulos(tomografia_segmentada, cabeza_izq, cabeza_der, numero_corte_izquierdo, numero_corte_derecho):

    # Segmentado
    corte_segmentado_acetabulo_izquierdo = tomografia_segmentada[:,
                                                                 :, numero_corte_izquierdo, 5]
    corte_segmentado_acetabulo_izquierdo = preprocesarAxialSegmentado.procesarCorte(
        corte_segmentado_acetabulo_izquierdo)

    corte_segmentado_acetabulo_derecho = tomografia_segmentada[:,
                                                               :, numero_corte_derecho, 4]
    corte_segmentado_acetabulo_derecho = preprocesarAxialSegmentado.procesarCorte(
        corte_segmentado_acetabulo_derecho)

    x_der, y_der, r_der = cabeza_der
    x_izq, y_izq, r_izq = cabeza_izq

    # Detecto PASA
    x_pasa_der, y_pasa_der, angulo_pasa_der,_ = pasa.detectar(
        corte_segmentado_acetabulo_derecho, x_der, y_der, x_izq, y_izq, r_der, "derecho")
    x_pasa_izq, y_pasa_izq, angulo_pasa_izq,_ = pasa.detectar(
        corte_segmentado_acetabulo_izquierdo, x_izq, y_izq, x_der, y_der, r_izq, "izquierdo")

    # Detecto AASA
    x_aasa_der, y_aasa_der, angulo_aasa_der,_ = aasa.detectar(
        corte_segmentado_acetabulo_derecho, x_der, y_der, x_izq, y_izq, r_der, "derecho")
    x_aasa_izq, y_aasa_izq, angulo_aasa_izq,_ = aasa.detectar(
        corte_segmentado_acetabulo_izquierdo, x_izq, y_izq, x_der, y_der, r_izq, "izquierdo")

    angulo_hasa_izq = angulo_aasa_izq + (angulo_pasa_izq*-1)
    angulo_hasa_der = (angulo_aasa_der*-1) + (angulo_pasa_der)

    angulos={
        "izquierdo":{
                "aasa":angulo_aasa_izq,
                "x_aasa":x_aasa_izq,
                "y_aasa":y_aasa_izq,
                "pasa":-1*angulo_pasa_izq,
                "x_pasa":x_pasa_izq,
                "y_pasa":y_pasa_izq,
                "hasa":angulo_hasa_izq
            },
        "derecho":{
                "aasa":-1*angulo_aasa_der,
                "x_aasa":x_aasa_der,
                "y_aasa":y_aasa_der,
                "pasa":angulo_pasa_der,
                "x_pasa":x_pasa_der,
                "y_pasa":y_pasa_der,
                "hasa":angulo_hasa_der
            }
    }
    return angulos


def graficar(id, base_path, composicion, coordenadas_izq, coordenadas_der, angulos, title):
    # Dibujo cabezas
    x_izq, y_izq, r_izq = coordenadas_izq
    cv2.circle(composicion, (x_izq, y_izq), r_izq,
               (0, 255, 0), 1)  # Círculo verde
    cv2.circle(composicion, (x_izq, y_izq), 1, (0, 255, 0), 1)  # Círculo verde

    x_der, y_der, r_der = coordenadas_der
    cv2.circle(composicion, (x_der, y_der), r_der,
               (0, 255, 0), 1)  # Círculo verde
    cv2.circle(composicion, (x_der, y_der), 1, (0, 255, 0), 1)  # Círculo verde

    # Dibujo la plomada
    cv2.line(composicion, (x_der, y_der), (x_izq, y_izq),
             (0, 255, 0), 2)  # Línea azul

    cv2.line(composicion, (x_der, y_der),
             # Línea verd
             (angulos["derecho"]["x_pasa"], angulos["derecho"]["y_pasa"]), (0, 255, 0), 1)
    cv2.line(composicion, (x_izq, y_izq),
             # Línea verd
             (angulos["izquierdo"]["x_pasa"], angulos["izquierdo"]["y_pasa"]), (0, 255, 0), 1)

    cv2.line(composicion, (x_der, y_der),
             # Línea verd
             (angulos["derecho"]["x_aasa"], angulos["derecho"]["y_aasa"]), (0, 255, 0), 1)
    cv2.line(composicion, (x_izq, y_izq),
             # Línea verd
             (angulos["izquierdo"]["x_aasa"], angulos["izquierdo"]["y_aasa"]), (0, 255, 0), 1)

    print("Voy a guardar")

    plt.figure(figsize=(18, 10))
    plt.subplot(1, 1, 1)
    plt.imshow(composicion, cmap='gray')
    plt.axis('off')
    output_path = f"{base_path}/temp-reports/{id}/{title}.png"
    plt.savefig(output_path, bbox_inches='tight', pad_inches=0)

    return output_path.replace("temp-reports", "reports")
 
