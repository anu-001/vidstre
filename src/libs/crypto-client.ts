import { AES, enc, format } from 'crypto-js'
import { ENCRYPTION_SECRET_KEY } from 'src/utils/env';

export const encryptData = (data: string) => {
  return AES.encrypt(data, ENCRYPTION_SECRET_KEY).toString(format.OpenSSL);
}

export const decryptData = (encryptedData: string) => {
  return AES.decrypt(encryptedData, ENCRYPTION_SECRET_KEY).toString(enc.Utf8)
}