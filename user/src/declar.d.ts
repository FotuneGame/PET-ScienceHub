import { MetaUser } from './models/user/MetaUser';
import { Setting } from './models/user/Setting';
import { User } from './models/user/User';
import { JWTType, ContactType } from './utils/types';



declare global {
  namespace Express {
    interface Request {
      body: {
        user?: User,
        metaUser?: MetaUser,
        setting?:Setting,

        tokens?:{
          access: string | null,
          refresh: string,
          body: JWTType
        },
        contact?: ContactType,
        
      }
    }
  }
}