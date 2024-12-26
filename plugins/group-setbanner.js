let handler = async (m, { conn, isRowner }) => {
  let time = global.db.data.users[m.sender].lastmiming + 60000;
  if (new Date - global.db.data.users[m.sender].lastmiming < 60000) {
    return conn.reply(m.chat, `⛄ Debes esperar ${msToTime(time - new Date())} para poder cambiar la foto del bot.`, m);
  }

  try {
    // Verificar si el mensaje es una imagen o contiene un archivo multimedia
    if (!m.quoted || !m.quoted.mtype.includes('imageMessage')) {
      return m.reply('🌲 Por favor, envía una imagen para cambiar el banner.');
    }

    // Descargar el archivo multimedia
    const media = await m.quoted.download();

    if (!isImageValid(media)) {
      return m.reply('🌲 El archivo enviado no es una imagen válida.');
    }

    global.icono = media;
    m.reply('❄️ El banner fue actualizado');
  } catch (error) {
    console.error(error);
    m.reply('✧ Hubo un error al intentar cambiar el banner.');
  }
};

const isImageValid = (buffer) => {
  const magicBytes = buffer.slice(0, 4).toString('hex');
  if (magicBytes === 'ffd8ffe0' || magicBytes === 'ffd8ffe1' || magicBytes === 'ffd8ffe2') {
    return true; // JPEG
  }
  if (magicBytes === '89504e47') {
    return true; // PNG
  }
  if (magicBytes === '47494638') {
    return true; // GIF
  }
  return false; 
};

handler.help = ['setbanner'];  
handler.tags = ['main'];    
handler.command = ['setban', 'setbanner'];  

export default handler;

function msToTime(duration) {
  let milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? '0' + hours : hours;
  minutes = (minutes < 10) ? '0' + minutes : minutes;
  seconds = (seconds < 10) ? '0' + seconds : seconds;

  return `${minutes} m y ${seconds} s`;
}
