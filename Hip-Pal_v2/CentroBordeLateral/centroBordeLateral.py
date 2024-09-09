import numpy as np
from PreprocesamientoDeCorte import preprocesarCoronal
from matplotlib import pyplot as plt

def detectar(cabezas_femur_axiales,tomografia_original):
    
    print(cabezas_femur_axiales["ecuatorial"]["izquierdo"]["numero_corte"])
    print(cabezas_femur_axiales["ecuatorial"]["izquierdo"]["coordenadas"])
    print(tomografia_original.shape)
    # Coordenadas del centro del círculo en la vista axial
    coordenadas = cabezas_femur_axiales["ecuatorial"]["izquierdo"]["coordenadas"]
    x,y,r=coordenadas
    numero_corte=cabezas_femur_axiales["ecuatorial"]["izquierdo"]["numero_corte"]
    # Visualizar la vista coronal correspondiente
    # Mantener las coordenadas X y Z
    coronal_slice = tomografia_original[:, y, :]
    coronal_slice = preprocesarCoronal.procesarCorte(coronal_slice)
    corte_rotado = np.rot90(coronal_slice,k=1)

    # Mostrar la imagen coronal
    plt.figure(figsize=(10, 7))
    plt.subplot(1, 1, 1)
    plt.imshow(corte_rotado, cmap="gray")
    plt.scatter(x, 280-numero_corte, color='red')  # Marcar el centro del círculo
    plt.title("Centroide del Círculo en la Vista Coronal")
    # plt.show()  
