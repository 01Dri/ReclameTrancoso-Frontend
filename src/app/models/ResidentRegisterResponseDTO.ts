export class ResidentRegisterResponseDTO {
	id!: number;
	name: string = "";
	email: string = "";
	cpf: string = "";
	buildingsIds!: number[];
	apartmentsIds!: number[];
}
