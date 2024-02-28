import { NextFunction, Request, Response } from "express";
import { dataSource } from "../../database/data-source";
import { User } from "./entity";
import { Transaction } from "../transaction/entity";
import { UsersIndexResponse } from "./types";

export class UserController {
  /**
   * @description users list.
   * @method GET
   * @param {Req} req
   * @param {Res} res
   */
  static index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // List all users
      const query = dataSource.createQueryBuilder().from(User, "user");

      query.select([
        "user.id as id",
        "user.username as username",
        "user.created as created",
      ]);
      const response: UsersIndexResponse = { data: null };

      if (req.query.related && req.query.related === "transactions") {
        query.leftJoin("user.transactions", "transaction")
        .addSelect("SUM(transaction.amount)", "totalAmount")
        .addSelect("COUNT(transaction.id)", "totalTransactions")
        .addSelect("MAX(transaction.created)", "lastTransaction")
        .groupBy("user.id");
        const totalAmountQuery = dataSource.createQueryBuilder(Transaction, "transaction")
        .select("SUM(transaction.amount)", "totals");
        const totalAmount = await totalAmountQuery.getRawOne();
        response.totals = totalAmount;
      }
      // Execute default query
      response.data = await query.getRawMany();

      // Response
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  /**
   * @description  Insertar transacción.
   * @method POST
   * @param {Req} req
   * @param {Res} res
   */
  static transaction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = res.locals.jwtPayload.id;
      const { amount,detail } = req.body;
      const newTransaction = new Transaction();
      newTransaction.detail = detail; 
      newTransaction.amount = amount; 
      newTransaction.user = id;
      await dataSource.manager.save(newTransaction);
      res.status(200).json({ message: 'Transacción insertada correctamente' });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  /**
   * @description Gets User entity.
   * @param {Req} req
   * @param {Res} res
   */
  static view = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = res.locals.jwtPayload.id;
      let user : User;
      if (req.query.related && req.query.related === "transactions") {
        user = await dataSource.manager.findOne(User, {
          where: { id: id },
          relations: ["transactions"]
        });
      }
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };
}
