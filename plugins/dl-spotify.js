import fetch from 'node-fetch';

let handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) {
    return conn.reply(
      m.chat,
      '[ ᰔᩚ ] Ingresa el nombre o palabra clave para buscar en *Spotify*.\n\n' +
        `Ejemplo:\n> *${usedPrefix + command}* url`,
      m,rcanal
    );
  }

  await m.react('🕓');

  try {
    let apiURL = `https://delirius-apiofc.vercel.app/download/spotifydlv3?url=${encodeURIComponent(text)}`;
    let apiDL = await fetch(apiURL);
    let jsonDL = await apiDL.json();

    if (jsonDL && jsonDL.status && jsonDL.data) {
      let { title, author, image, duration, url: musicUrl } = jsonDL.data;

      let durationMinutes = Math.floor(duration / 60000);
      let durationSeconds = ((duration % 60000) / 1000).toFixed(0);

      let caption = `🎶 *Título*: ${title}\n🖊️ *Autor*: ${author}\n⏳ *Duración*: ${durationMinutes}:${durationSeconds.padStart(2, '0')}\n🌐 *Enlace*: ${text}`;

      await conn.sendFile(m.chat, image, 'cover.jpg', caption, m,rcanal,fake);
      await conn.sendFile(m.chat, musicUrl, `${title}.mp3`, null, m);
      await m.react('✅');
    } else {
      await m.react('❌');
    }
  } catch (error) {
    console.error(error);
  }
};

handler.command = /^(spotify|sp|Spotify)$/i;
handler.tags = ["search"];
handler.register = true;

export default handler;
