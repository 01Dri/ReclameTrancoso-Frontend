export class RefreshTokenRequestDTO {
	refreshToken: string = "";

	constructor(refreshToken: string) {
		this.refreshToken = refreshToken;
	}
}
