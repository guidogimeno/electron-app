






def obtenerCentroide(tomografia_original,coordenadas,numero_corte):
    _,_,eje_ordenadas=tomografia_original.shape
    x,z,_=coordenadas
    y=eje_ordenadas-numero_corte
    return x,y,z
