import DiscordOAuth2 from 'discord-oauth2';
import { env } from './envLoad'
import { encrypt, decrypt, nonce } from './encryption';
import { redirect, type Cookies } from "@sveltejs/kit";
import { getContext, setContext } from 'svelte';

const oauth2 = new DiscordOAuth2({
  clientId: env.oauth.clientId,
  clientSecret: env.oauth.clientSecret,
  redirectUri: env.oauth.redirectUri,
});

export const isUserAllowed = (encryptedToken: string) => {
  const token = decrypt(encryptedToken);

  oauth2.getUser(token).then((userObject) => {
    if(!userObject.id) {
      return false;
    }
    return env.userList.includes(userObject.id);
  })
}

export const getToken = (code: string, state: string) => {
  const localState = getContext('discordState');
  if (localState !== state) {
    throw redirect(307, '/overlay-scenes');
  } else {
    oauth2.tokenRequest({
      grantType: "authorization_code",
      code: code,
      scope: "identify",
    }).then((response) => {
      if(!response.access_token) {
        throw redirect(307, '/overlay-scenes');
      } else {
        return encrypt(response.access_token);
      }
    })
  }
}

export function getAuthCode() {
  const userState = nonce;
  setContext('discordState', userState);
  throw redirect(307, oauth2.generateAuthUrl({
    scope: ["identify"],
    responseType: "code",
    prompt: 'none',
    state: userState
  }));
}