export default () => ({
  apiKeySecretName: process.env.API_KEY_SECRET_NAME,
  categoryPathParameterName: process.env.CATEGORY_PATH_PARAMETER_NAME,
  categoryApiKeySecretName: process.env.CATEGORY_API_KEY_SECRET_NAME,
  jwtSecret: process.env.JWT_SECRET,
  jwtAccessTokenExpirationTime: Number(
    process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME ?? 900,
  ),
  jwtRefreshTokenExpirationTime: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
});
