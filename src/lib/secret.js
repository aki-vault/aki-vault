import {
    createMessage, decrypt, encrypt, readMessage,
  } from 'openpgp';
  
  const randomInt = (min, max) => {
    const byteArray = new Uint8Array(1);
    window.crypto.getRandomValues(byteArray);
  
    const range = max - min;
    const maxRange = 256;
    if (byteArray[0] >= Math.floor(maxRange / range) * range) {
      return randomInt(min, max);
    }
    return min + (byteArray[0] % range);
  };
  
  export const randomString = () => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 22; i += 1) {
      text += possible.charAt(randomInt(0, possible.length));
    }
    return text;
  };
  
  export const encryptMessage = async (message, passwords) => {
    const data = await encrypt({
      message: await createMessage({ text: message }),
      passwords,
    });
    return data;
  };
  
  export const decryptMessage = async (data, passwords) => {
    const message = await readMessage({
      armoredMessage: data,
    });
  
    return decrypt({
      message,
      passwords,
      format: 'utf8',
    });
  };
  
  export const backendDomain = process.env.REACT_APP_BACKEND_URL;
  
  const post = async (url, body) => {
    const request = await fetch(url, {
      body: JSON.stringify(body),
      method: 'POST',
    });
    return { data: await request.json(), status: request.status };
  };
  
  export const postSecret = async (body) => post(`${backendDomain}/secret`, body);
  