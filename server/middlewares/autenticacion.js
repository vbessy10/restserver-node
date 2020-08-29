const jwt = require('jsonwebtoken');

//***************************/
/*      Verificar Token     */
//***************************/

let verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });

};

//***************************/
/*    Verificar Rol ADMIN   */
//***************************/

let verificaAdminRol = (req, res, next) => {
    let usuario = req.usuario;
    console.log(usuario);
    if (!(usuario.role === 'ADMIN_ROLE')) {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

    //req.usuario = decoded.usuario;
    next();

};

module.exports = {
    verificaToken,
    verificaAdminRol
}