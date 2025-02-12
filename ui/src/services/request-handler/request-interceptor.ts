import toast from 'react-hot-toast';
import { container } from 'tsyringe';
import parseResponseErrors from 'helpers/apiErrorParser';
import { apiUrl, createRequestUrl } from '../../config/app.config';
import StorageHandler from '../storage-handler/storage-handler';
import StorageItem from '../storage-handler/storage-item';
import RequestType from './request-type';
import { ResponseBase } from './response-base';

const storageHandler = container.resolve(StorageHandler);

interface AuthenticationResponseDto {
  accessToken: string;
  refreshToken: string;
}

interface RefreshAuthenticationRequestDto {
  accessToken: string;
  refreshToken: string;
}

async function customFetch(url: string, method: RequestType, body?: string): Promise<Response> {
  const accessToken: StorageItem = storageHandler.GetLocalStorage('access_token');

  const languageHeader: StorageItem = storageHandler.GetLocalStorage('language');

  const requestHeaders: HeadersInit = new Headers();

  if (method !== RequestType.Patch) {
    requestHeaders.set('Content-Type', 'application/json');
  } else {
    requestHeaders.set('Content-Type', 'application/json-patch+json; charset=UTF-8');
    requestHeaders.set('accept', 'application/json');
  }

  if (languageHeader) requestHeaders.set('Accept-Language', languageHeader.value);

  if (url === createRequestUrl(apiUrl.coreUrl)) {
    return fetch(url, {
      body,
      method,
      headers: requestHeaders,
    });
  }

  if (accessToken == null) {
    toast.error('Oturumunuzun süresi doldu, tekrar giriş yapınız.');
    sessionStorage.removeItem('user');
    throw new Error('Unauthenticated');
  }

  if (!accessToken.expired) {
    requestHeaders.set('Authorization', `Bearer ${accessToken.value}`);
  }

  if (accessToken.expired) {
    const refreshToken = storageHandler.GetCookie('refresh_token');

    if (refreshToken == null) {
      toast.error('Oturumunuzun süresi doldu, tekrar giriş yapınız.');
      sessionStorage.removeItem('user');
      throw new Error('Unauthenticated');
    }

    const data: RefreshAuthenticationRequestDto = {
      accessToken: accessToken.value,
      refreshToken,
    };
    await fetch(createRequestUrl(apiUrl.coreRefreshUrl), {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        accept: 'application/json',
      },
    })
      .then(async response => {
        const responseJson = await response.json();
        if (!response.ok) {
          const responseData = responseJson as ResponseBase<AuthenticationResponseDto>;
          if (responseData.errors != null) {
            const validationError = parseResponseErrors(responseData.errors);
            toast.error(`${validationError}`);
          } else {
            toast.error(`${responseData.detail}`);
            return;
          }
        }
        const responseData: AuthenticationResponseDto = responseJson;
        storageHandler.SetLocalStorage('access_token', responseData.accessToken);
        storageHandler.CreateCookie('refresh_token', responseData.refreshToken, 345600, '/');
        requestHeaders.set('Authorization', `Bearer ${responseData.accessToken}`);
      })
      .catch(() => {
        toast.error('Oturumunuzun süresi doldu, tekrar giriş yapınız.');
        sessionStorage.removeItem('user');
      });
  }

  return fetch(url, {
    body,
    method,
    headers: requestHeaders,
    mode: 'cors',
  });
}

export default customFetch;
