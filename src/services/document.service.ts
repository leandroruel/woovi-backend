import {
  CONECTAGOV_API_URL,
  CONECTAGOV_CLIENT_ID,
  CONECTAGOV_CLIENT_SECRET,
  CONECTAGOV_OAUTH_URL,
} from "@/helpers/document";
import { extractExp } from "@/helpers/jwt";
import { isBefore } from "date-fns";

let tokenStorage: { access_token: string } | null = null;

const EXPIRATION_WINDOW_IN_SECONDS = 300;

/**
 * Autentica a aplicação no ConectaGov
 * @param ctx {any} Contexto da requisição
 * @returns {Promise<any>} Retorna a resposta da requisição
 */
const authenticate = async (ctx: any): Promise<any> => {
  try {
    const options = {
      method: "POST",
      url: CONECTAGOV_OAUTH_URL,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${CONECTAGOV_CLIENT_ID}:${CONECTAGOV_CLIENT_SECRET}`,
        ).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    };

    const response = await ctx.curl(options.url, options);

    return response;
  } catch (error: any) {
    throw new Error(error);
  }
};

/**
 * Trata a requisição de token
 * @param ctx {any} Contexto da requisição
 */
const handleTokenRequest = async (ctx: any) => {
  try {
    const response = await authenticate(ctx);
    tokenStorage = JSON.parse(response.body);
  } catch (error) {
    console.error("Erro na obtenção do token:", error);
    throw new Error("Failed to obtain token");
  }
};

/**
 * Obtém o token de acesso do local storage ou faz uma nova requisição
 * @param ctx {any} Contexto da requisição
 * @returns {Promise<string>} Retorna o token de acesso
 */
const getToken = async (ctx: any): Promise<string | undefined> => {
  if (!tokenStorage || isTokenExpired(tokenStorage.access_token)) {
    await handleTokenRequest(ctx);
  }

  return tokenStorage?.access_token;
};

/**
 *  Verifica se o token está expirado e retorna um booleano
 * @param accessToken {string} Token de acesso
 * @returns {boolean} Retorna um booleano
 */
const isTokenExpired = (accessToken: string): boolean => {
  const exp = extractExp(accessToken);
  const expirationDate = new Date(exp * 1000);
  return isBefore(
    expirationDate,
    Date.now() + EXPIRATION_WINDOW_IN_SECONDS * 1000,
  );
};

export const validateDocument = async (ctx: any) => {
  const token = await getToken(ctx);

  const options = {
    method: "GET",
    url: `${CONECTAGOV_API_URL}/api-cpf-light/v2/consulta/cpf`,
    headers: {
      Authorization: `Bearer ${token}`,
      "x-cpf-usuario": ctx.request.body.cpf,
    },
    params: {
      document: ctx.params.document,
    },
  };

  const response = await ctx.curl(options.url, options);

  return response;
};

export default { validateDocument };
