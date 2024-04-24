export const currentTime = (addedMinutes) => {
  const currentDate = new Date();
  currentDate.setMinutes(currentDate.getMinutes() + addedMinutes);

  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Los meses comienzan desde 0
  const year = currentDate.getFullYear();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

//hacer una utilidad que devuelva fechas con / y \ invertidos y
//que si la ruta lleva "/" al final hay que quitárselo

export function dateDifference(fecha1, fecha2) {
  // Parsear las fechas manualmente
  const [dia1, mes1, anio1, hora1, minuto1, segundo1] = fecha1.split(/[\/: ]/);
  const [dia2, mes2, anio2, hora2, minuto2, segundo2] = fecha2.split(/[\/: ]/);
  const date1 = new Date(anio1, mes1 - 1, dia1, hora1, minuto1, segundo1);
  const date2 = new Date(anio2, mes2 - 1, dia2, hora2, minuto2, segundo2);

  const diferenciaEnMilisegundos = date2 - date1;

  const diferenciaEnMinutos = Math.floor(
    diferenciaEnMilisegundos / (1000 * 60)
  );

  return diferenciaEnMinutos;
}

export function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}

export function obtenerUltimaParteDeRuta(ruta) {
  // Dividir la ruta en segmentos usando el carácter "/"
  const segmentos = ruta.split("/");
  // Tomar el último segmento
  const ultimaParte = segmentos[segmentos.length - 1];
  // Devolver el último segmento junto con el carácter "/" al principio
  return "/" + ultimaParte;
}

export function obtenerParteSinUltimoSegmento(ruta) {
  // Dividir la ruta en segmentos usando el carácter "/"
  const segmentos = ruta.split("/");
  // Eliminar el último segmento
  segmentos.pop();
  // Unir los segmentos restantes de nuevo en una cadena, agregando "/" entre ellos
  return segmentos.join("/");
}
