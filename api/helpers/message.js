import dotenv from 'dotenv';

dotenv.config();

export const sendMessage = (phone, number) => {
    const url = process.env.WS_URL;
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${process.env.WS_TOKEN}`
      },
      body: JSON.stringify({
        chatId: `57${phone}@c.us`,
        message: `Gracias por apoyar la rifa profondos torneo Chinauta 2024 - Club Deportivo Atletico Independiente - categoría 2013-2014-2015. Recuerda que tu número para el sorteo es el ${number}`,
      })
    };
    
    fetch(url, options)
      .then(res => res.json())
      .then(json => console.log(json))
      .catch(err => console.error(err));
}