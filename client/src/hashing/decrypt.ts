import { AES, enc } from "crypto-js";
export const decryptMessage = (encryptedMessage: string) => {
  try {
    const env: string | undefined = process.env.NEXT_PUBLIC_ENG_ENV;
    const secretKey: string | undefined = process.env.NEXT_PUBLIC_HASHING_KEY;
    if (env == "production") {
      const bytes = AES.decrypt(encryptedMessage, secretKey || "");
      const decrypted = bytes.toString(enc.Utf8);
      return JSON.parse(decrypted);
    } else return encryptedMessage;
  } catch (err) {
    console.log("UNABLE TO DECIPHER", err);
  }
};
