import express from "express";
import { UserController } from "./components/user/controller";
import { UtilsController } from "./components/utils/controller";
import { AuthController } from "./components/auth/controller";
import * as AuthMiddleware from './components/auth/middleware';
import * as UtilsMiddleware from './components/utils/middleware';
import passport from 'passport';

export const routes = express.Router();
const adminRole = '1' 
const customerRole = '2' 

// Generate new password
routes.patch('/private/utils/user/:id/password/reset',
  // AuthMiddleware.authenticateJWT,
  UtilsMiddleware.passwordResetMiddleware,
  AuthMiddleware.checkRoleAdmin,
  // [AuthMiddleware.checkRole([adminRole])],
  UtilsController.passwordUpdate
);

// Login
routes.post("/login", AuthMiddleware.authMiddleware, AuthController.login);

// User endpoints:

// insertar transaction
routes.post("/user/transaction", 
  AuthMiddleware.insertTransactionMiddleware,
  AuthMiddleware.authenticateJWT,
  // [AuthMiddleware.checkRole([customerRole , adminRole])],
  UserController.transaction
);

//Obtener transacciones de un usuario
routes.get("/user", 
  AuthMiddleware.authenticateJWT,
  UserController.view
);

// Admin endpoints.
routes.get("/private/users", 
  AuthMiddleware.authenticateJWT,
  [AuthMiddleware.checkRole([adminRole])],
  UserController.index
);
