//***************************/
/*          Puerto          */
//***************************/

process.env.PORT = process.env.PORT || 3000;

//***************************/
/*          Entorno         */
//***************************/

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//***************************/
/*     Vencimiento Token    */
//***************************/
// 60 seg * 60 min * 24 horas * 30 dias

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//***************************/
/*           SEED           */
//***************************/

process.env.SEED = process.env.SEED || 'secret';

//***************************/
/*            DB            */
//***************************/

let urlDB;

if (process.env.NODE_ENV == 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL;
}

process.env.URLDB = urlDB;

//***************************/
/*     Google client ID     */
//***************************/

process.env.CLIENT_ID = process.env.CLIENT_ID || '274436618038-a7ll94m9hjao5l6qer5tgu367mu1c31o.apps.googleusercontent.com';