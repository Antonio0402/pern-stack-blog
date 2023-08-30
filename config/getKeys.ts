import * as path from "node:path";
import * as fs from 'node:fs';
const __dirname = path.resolve();

const pathToPrivIDKey = path.join(__dirname, "id_rsa_priv.pem");
const pathToPubIDkey = path.join(__dirname, "id_rsa_pub.pem");
const pathToPrivRefKey = path.join(__dirname, "ref_rsa_priv.pem");
const pathToPubRefkey = path.join(__dirname, "ref_rsa_pub.pem");

export const privAccessKey = fs.readFileSync(pathToPrivIDKey);
export const pubAccessKey = fs.readFileSync(pathToPubIDkey);

export const privRefreshKey = fs.readFileSync(pathToPrivRefKey);
export const pubRefreshKey = fs.readFileSync(pathToPubRefkey);