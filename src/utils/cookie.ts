export function getCookie(name: string): string | undefined {
  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        // eslint-disable-next-line no-useless-escape
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(
  name: string,
  value: string,
  props: { [key: string]: string | number | Date | boolean } = {}
) {
  props = {
    path: '/',
    ...props
  };

  let exp = props.expires;
  if (exp && typeof exp === 'number') {
    const d = new Date();
    d.setTime(d.getTime() + exp * 1000);
    exp = props.expires = d;
  }

  if (exp && exp instanceof Date) {
    props.expires = exp.toUTCString();
  }
  value = encodeURIComponent(value);
  let updatedCookie = name + '=' + value;
  for (const propName in props) {
    updatedCookie += '; ' + propName;
    const propValue = props[propName];
    if (propValue !== true) {
      updatedCookie += '=' + propValue;
    }
  }
  document.cookie = updatedCookie;
}

export function deleteCookie(name: string) {
  setCookie(name, '', { expires: -1 });
}

interface TokenStorage {
  persistAuthCredential: (credential: string, shortTermKey: string) => void;
  clearAuthCredentials: () => void;
}

const createTokenManager = (): TokenStorage => {
  const longTermStorageKey = 'sessionCredential';
  const shortTermStorageKey = 'authToken';

  return {
    persistAuthCredential: (longTermCred: string, shortTermCred: string) => {
      window.localStorage.setItem(longTermStorageKey, longTermCred);
      document.cookie = `${shortTermStorageKey}=${shortTermCred}; path=/; secure; samesite=strict`;
    },

    clearAuthCredentials: () => {
      window.localStorage.removeItem(longTermStorageKey);
      document.cookie = `${shortTermStorageKey}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  };
};

export const authTokenManager = createTokenManager();

// Usage example:
// authTokenManager.persistAuthCredential(refreshToken, accessToken);
// authTokenManager.clearAuthCredentials();
