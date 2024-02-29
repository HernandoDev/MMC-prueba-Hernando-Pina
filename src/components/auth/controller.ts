import { NextFunction, Request, Response } from "express";
import { AuthServices } from "./services";
import environmentVars from "../../config/env";
import jwt from 'jsonwebtoken';

export class AuthController {
  /**
   * @description Metodo que realiza el Login  de un usuario y genera un token JWT para retornarlo junto a los datos del usuario
   * @param {Req} req
   * @param {Res} res
   */
  static login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Your code here: Generate JWT
      const user = await AuthServices.findUser(req.body.username);
      if (!user) {
        return res.status(400).json({ error: 'Username no encontrado' });
      }
      const isValidPassword = await AuthServices.validatePassword(req.body.password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ error: 'Contraseña incorrecta' });
      }
      const token = jwt.sign({ id: user.id }, environmentVars.JWT_PASSPHRASE, {
        expiresIn: environmentVars.JWT_EXPIRES_IN,
      });
      delete user.password;
      let message = 'Sesión iniciada'
      res.status(200).json({ token ,user,message});
    } catch (error) {
      console.log("catch",error);
      let message = 'Error al inciar sesión'
      res.status(400).json(error);
    }
  };
}
