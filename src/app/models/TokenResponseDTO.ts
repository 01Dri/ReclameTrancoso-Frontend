export class TokenResponseDTO {
	accessToken: string = "";
	refreshToken: string = "";
	accessTokenExpiresAt!: Date;
	refreshTokenExpiresAt!: Date;
	
}
