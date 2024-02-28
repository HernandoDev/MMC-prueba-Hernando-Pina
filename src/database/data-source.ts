import { DataSource } from "typeorm";
import { User } from "../components/user/entity";
import { Role } from "../components/role/entity";
import { Transaction } from "../components/transaction/entity";

export const dataSource = new DataSource({
  type: "mysql",
  host: "localhost", // Cambiado de "db" a "localhost"
  port: 3306,
  username: "root2",
  password: "root2",
  database: "mmc_technicaltest",
  entities: [User, Role, Transaction],
  logging: true,
  synchronize: true,
});