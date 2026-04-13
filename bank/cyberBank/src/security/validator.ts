import { Action } from 'routing-controllers';
import jwt from 'jsonwebtoken';
import Env from '../env';


async function Authorized (action: Action) {
    if (!action.request.cookies) return false;
  
    const token: string = action.request.cookies.jwt;
    if (!token) return false;
  
    try {
      jwt.verify(token, Env.SESSION_SECRET);
      return true;
    } catch (err: any) {
      console.log(err);
      return false;
    };
  }

export default Authorized