export class TokenResponseDTO {
	residentId!: number;
	accessToken: string = "";
	refreshToken: string = "";
	accessTokenExpiresAt!: Date;
	refreshTokenExpiresAt!: Date;
	
}
 