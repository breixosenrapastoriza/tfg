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
  const date1 = new Date(fecha1);
  const date2 = new Date(fecha2);

  const diferenciaEnMilisegundos = date2 - date1;

  const diferenciaEnMinutos = Math.floor(
    diferenciaEnMilisegundos / (1000 * 60)
  );

  return diferenciaEnMinutos;
}
