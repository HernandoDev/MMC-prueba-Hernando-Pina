import { NextFunction, Request, Response } from "express";
import { AuthServices } from "./services";
import environmentVars from "../../config/env";
import jwt from 'jsonwebtoken';

export class AuthController {
  /**
   * @description Gets the User view.
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
      res.status(200).json({ token });
    } catch (error) {
      console.log("catch",error);
      res.status(400).json(error);
    }
  };
}
