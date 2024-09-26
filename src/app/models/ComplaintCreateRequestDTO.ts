import { ComplaintStatus } from "../enums/ComplaintStatus";
import { ComplaintType } from "../enums/ComplaintType";

export class ComplaintCreateRequestDTO {

    residentId!: number;
    title!: string;
    description!: string;
    complaintType!: ComplaintType;
    additionalInformation1!: string;
    additionalInformation2!: string;
    additionalInformation3!: string;
    IsAnonymous!: boolean;
    status!: ComplaintStatus
}