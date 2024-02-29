import { NextFunction, Request, Response } from "express";
import * as argon2 from "argon2";
import { dataSource } from "../../database/data-source";
import { User } from "../user/entity";

export class UtilsController {
  /**
   * @description Obtiene el usuario para luego actualizar  la contraseña de un usuario.
   * @param {Req} req
   * @param {Res} res
   */
  static passwordUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { password } = req.body;
      const { id } = req.params; 
      if (!password) {
        return res.status(400).json({ error: 'Password es necesario' });
      }
      const hash = await argon2.hash(password);
      // const hash = password;
      await UtilsController.updateUserPassword(id, hash);
      res.status(200).json({ message: 'Password actualizada correctamente' });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  /**
   * @description Actualiza  la contraseña de un usuario.
   * @param {userId} 
   * @param {passwordHash} 
   */
  static updateUserPassword = async (userId, passwordHash) => {
    try {
      const user = await dataSource.manager.findOne(User, {
        where: { id: userId },
      });
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      user.password = passwordHash;
      await dataSource.manager.save(user);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
