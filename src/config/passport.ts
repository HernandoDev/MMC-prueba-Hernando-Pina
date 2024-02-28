import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../components/user/entity';
import environmentVars from './env';
import { dataSource } from "../database/data-source";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: environmentVars.JWT_PASSPHRASE,
};

passport.use(
  new JwtStrategy(options, async (jwtPayload, done) => {
    let user: User;
    try {
      const user = await dataSource.manager.findOneBy(User, {
        id: jwtPayload.id,
      })
      if (user) {
        return done(null, user);
      } else {
        console.log('Usuario no encontrado');
        return done(null, false);
      }
    } catch (id) {
        console.log('Passport Catch');
        return done(null, false);
    }
  })
);
