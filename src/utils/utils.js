import { getFlashcards } from "../config/firebase";

export const enumToNumber = (enumeration) => {
  if (enumeration === "high") {
    return 2;
  } else if (enumeration == "standar") {
    return 1;
  } else {
    return 0.5;
  }
};

export const deckHasTraining = async (ruta, user) => {
  const list = await getFlashcards(user);
  const filtered_list = list.filter((element) => element.path.startsWith(ruta));
  for (let index = 0; index < filtered_list.length; index++) {
    const card = filtered_list[index];
    if (dateDifference(currentTime(0), card.time) <= 0) {
      return true;
    }
  }
  return false;
};

export const deckKnowledge = async (ruta, user) => {
  const list = await getFlashcards(user);
  const filtered_list = list.filter((element) => element.path.startsWith(ruta));
  const sumWithInitial = filtered_list.reduce(
    (accumulator, currentValue) => accumulator + currentValue.knowledge,
    0
  );
  const length = filtered_list.length == 0 ? 1 : filtered_list.length;
  return sumWithInitial / length;
};

export const deckLength = async (ruta, user) => {
  const list = await getFlashcards(user);
  const filtered_list = list.filter((element) => element.path.startsWith(ruta));
  return filtered_list.length;
};

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

export function obtenerSegmentosRuta(ruta) {
  const partes = ruta.split("\\");
  const rutas = partes
    .map((_, index) => partes.slice(0, index + 1).join("\\"))
    .filter((elem) => elem !== "")
    .map((ruta) => ruta.replace(/\\\\/g, "\\"));
  return rutas;
}

export function insertarSlash(name) {
  return name.startsWith("/") ? name : "/" + name;
}

export function addLeadingZeros(dateString) {
  // Separar la fecha y la hora
  const [date, time] = dateString.split(" ");

  // Separar horas, minutos y segundos
  const [hours, minutes, seconds] = time
    .split(":")
    .map((num) => num.padStart(2, "0"));

  // Reconstruir la hora con ceros a la izquierda
  const formattedTime = `${hours}:${minutes}:${seconds}`;

  // Reconstruir la fecha completa con la hora formateada
  const formattedDate = `${date} ${formattedTime}`;

  return formattedDate;
}
