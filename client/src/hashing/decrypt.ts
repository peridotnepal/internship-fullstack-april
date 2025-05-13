// import { AES, enc } from "crypto-js";
// export const decryptMessage = (encryptedMessage: string) => {
//   try {
//     const env: string | undefined = process.env.NEXT_PUBLIC_ENG_ENV;
//     const secretKey: string | undefined = process.env.NEXT_PUBLIC_HASHING_KEY;
//     if (env == "production") {
//       const bytes = AES.decrypt(encryptedMessage, secretKey || "");
//       const decrypted = bytes.toString(enc.Utf8);
//       return JSON.parse(decrypted);
//     } else return encryptedMessage;
//   } catch (err) {
//     console.log("UNABLE TO DECIPHER", err);
//   }
// };

import { AES, enc } from "crypto-js";

export const decryptMessage = (encryptedMessage: string) => {
  try {
    const env = process.env.NEXT_PUBLIC_ENG_ENV;
    const secretKey = process.env.NEXT_PUBLIC_HASHING_KEY;

    // Validate inputs
    if (!encryptedMessage) {
      throw new Error("Missing encrypted message.");
    }

    if (env === "production") {
      if (!secretKey) {
        throw new Error("Missing secret key for decryption.");
      }

      const bytes = AES.decrypt(encryptedMessage, secretKey);
      const decrypted = bytes.toString(enc.Utf8);

      if (!decrypted) {
        throw new Error("Failed to decrypt: result is empty.");
      }

      return JSON.parse(decrypted);
    }

    // Return raw string in development
    return encryptedMessage;

  } catch (err) {
    if (err instanceof Error) {
      console.error("UNABLE TO DECIPHER:", err.message);
    } else {
      console.error("UNABLE TO DECIPHER:", err);
    }
    return null; // Return null to handle it gracefully in caller function
  }
};
