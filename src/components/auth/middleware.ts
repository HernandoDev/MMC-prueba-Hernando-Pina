
import { Request, Response, NextFunction } from 'express';
import { User } from '../user/entity';
import { dataSource } from "../../database/data-source";
import passport from 'passport';

export const authMiddleware = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Se requiere username y password' });
  }
  next();
};
export const insertTransactionMiddleware = (req, res, next) => {
  const { amount,detail } = req.body;
  if (!amount || !detail) {
    return res.status(400).json({ error: 'Se requiere  amount y detail' });
  }
  next();
};
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      console.error(err);
      return res.status(401).send('Error de autenticación');
    }
    if (info) {
      return res.status(401).send(info.message);
    }
    if (user) {
      res.locals.jwtPayload = user;
    }
    next();
  })(req, res, next);
};
export const authenticateJWT2 = (req: Request, res: Response, next: NextFunction) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        console.error(err);
        // reject(res.status(401).send('Error de autenticación'));
      }
      if (info) {
        // reject(res.status(401).send(info.message));
      }
      if (user) {
        res.locals.jwtPayload = user;
        resolve(user);
        return user
      }
      // next();
    })(req, res, next);
  });
};

export const checkRoleAdmin = async (req, res, next) => {
  const { id } = req.params; 
  let user: User;
  try {
    const user = await dataSource.manager.findOne(User, {
      where: { id:  parseInt(id) },
      relations: ["role"]
    });
      if (user.role.id.toString() === '1') {
        console.log('El usuario es un administrador');
        next();
      } else {
        const idJwt = await authenticateJWT2(req, res, next) as { id: number };
        const userJwt = await dataSource.manager.findOne(User, {
          where: { id: idJwt.id },
          relations: ["role"]
        });
        console.log('user.role.id',user.role.id);
      if (user.role.id.toString() === '1') {
        console.log('El usuario es un administrador JWT');
        next();
      }else{
        res.status(401).send('Error: El usuario no tiene permiso para acceder a este recurso JWT');
      }
    }
  } catch (error) {
    console.log(error);
    res.status(401).send('Error: No se pudo encontrar al usuario');
    return;
  }
};


export const checkRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Obtiene el ID del usuario de los datos del token JWT
    const id = res.locals.jwtPayload.id;
    let user: User;
    try {
      const user = await dataSource.manager.findOne(User, {
        where: { id: id },
        relations: ["role"]
      });
      if (roles.indexOf(user.role.id.toString()) > -1) {
        if (user.role.id.toString() === '1') {
          console.log('El usuario es un administrador');
        } else if (user.role.id.toString() === '2') {
          console.log('El usuario es un cliente');
        }
        next();
      } else {
        res.status(401).send('Error: El usuario no tiene permiso para acceder a este recurso');
      }
    } catch (error) {
      console.log(error);
      res.status(401).send('Error: No se pudo encontrar al usuario');
      return;
    }
  };
};

