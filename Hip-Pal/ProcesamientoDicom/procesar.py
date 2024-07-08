import os
from matplotlib import pyplot as plt
import numpy as np
import pydicom
import ProcesamientoDicom.desenfoque as desenfoque
import ProcesamientoDicom.ruido as ruido

def aplicar_window_level(image, window_center, window_width):
    # Convierte los valores de píxeles a un rango de 0 a 255 basado en el window center y window width
    min_val = window_center - (window_width / 2)
    max_val = window_center + (window_width / 2)

    # Aplica la transformación lineal
    image = np.clip(image, min_val, max_val)
    image = (image - min_val) / (max_val - min_val) * 255.0

    return image.astype(np.uint8)


#Aca es donde se aplican los filtros a cada corte. Blur, HU>200, etc....
def procesar_archivo(ruta_archivo_dicom):

    #Procesa un archivo DICOM y devuelve información relevante sobre los círculos encontrados.
    corte = pydicom.dcmread(ruta_archivo_dicom)


    # Establece nuevos valores para Window Center y Window Width
    nuevo_window_center = 350  # Ejemplo de nuevo valor
    nuevo_window_width = 1  # Ejemplo de nuevo valor

    # Modifica los valores en el objeto Dataset
    corte.WindowCenter = nuevo_window_center
    corte.WindowWidth = nuevo_window_width

    corte_original = corte.pixel_array
    nombre_corte = os.path.basename(corte.filename)

    # Aplica el window level y window width a la imagen
    imagen_transformada = aplicar_window_level(corte_original, nuevo_window_center, nuevo_window_width)

    # Obtener Slice Thickness
    slice_thickness = corte.SliceThickness if 'SliceThickness' in corte else 'N/A'

    # Obtener Convolution Kernel
    convolution_kernel = corte.ConvolutionKernel if 'ConvolutionKernel' in corte else 'N/A'

    # Obtener Reconstruction Algorithm
    reconstruction_algorithm = corte.get('ReconstructionAlgorithm', 'N/A')
    


    """"
    print("------------------------")

    # Imprimir los valores obtenidos
    print(f"Slice Thickness: {slice_thickness}")
    print(f"Convolution Kernel: {convolution_kernel}")
    print(f"Reconstruction Algorithm: {reconstruction_algorithm}")

    print("------------------------")
    """
    rescale_intercept = corte.RescaleIntercept if 'RescaleIntercept' in corte else 0
    rescale_slope = corte.RescaleSlope if 'RescaleSlope' in corte else 1
    imagen_hu = corte_original * rescale_slope + rescale_intercept
    
    #ACA ARRANCA LO IMPORTANTE----------------------------------------------------------------
    #Saco el ruido
    #corte_sin_ruido = ruido.limpiar(imagen_transformada)

    #Aplicamos desenfoque para facilitar la deteccion de angulos.
    corte_desenfocado=desenfoque.aplicar(imagen_transformada)


    ##Si cambio a TRUE puedo ver como queda la imagen desenfocada.
    if(False):
        plt.figure(figsize=(20, 5))

        plt.subplot(1, 4, 2)
        plt.title('Angulos Sector Acetabular')
        plt.imshow(corte_sin_ruido, cmap='gray')
        plt.axis('off')
        plt.show()

    return corte_original, nombre_corte, imagen_transformada, corte_desenfocado
