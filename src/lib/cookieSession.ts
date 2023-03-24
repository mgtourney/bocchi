import cookieSession from 'cookie-session';
import Keygrip from 'keygrip';
import * as envfile from '../../.env.json'

export function cookieSessionMiddleware() {
  return cookieSession({
    name: 'session',
    keys: new Keygrip(envfile.cookieKeys),
  });
}