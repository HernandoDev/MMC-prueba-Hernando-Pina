import { dataSource } from "../../database/data-source";
import { User } from "../user/entity";
import * as argon2 from "argon2";


export class AuthServices {
  /**
   * @description Busca usuario por username.
   * @param {string} username
   */

  static async findUser(username: string) {
    if (username == null){
      return null
    }
    const user = await dataSource.manager
      .createQueryBuilder(User, 'user')
      .addSelect('user.password')
      .where('user.username = :username', { username })
      .getOne();
    return user;
  };

  /**
   * @description Valida la pass del usuario.
   * @param {string} inputPassword
   * @param {string} userPassword
   */

  static async validatePassword(inputPassword: string, userPassword: string) {
      const passwordMatch = await argon2.verify(userPassword.toString(), inputPassword.toString());
      return passwordMatch;
    // return inputPassword == userPassword  ;
  };
}
