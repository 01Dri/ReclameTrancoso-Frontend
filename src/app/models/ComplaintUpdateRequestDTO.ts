import { ComplaintStatus } from "../enums/ComplaintStatus";
import { ComplaintType } from "../enums/ComplaintType";

export class ComplaintUpdateRequestDTO {

    residentId!: number;
    title!: string;
    description!: string;
    complaintType!: ComplaintType;
    additionalInformation1!: string;
    additionalInformation2!: string;
    additionalInformation3!: string;
    IsAnonymous!: boolean;
    status!: ComplaintStatus

    constructor(
        residentId: number,
        title: string,
        description: string,
        complaintType: ComplaintType,
        additionalInformation1: string,
        additionalInformation2: string,
        additionalInformation3: string,
        isAnonymous: boolean,
        status: ComplaintStatus
    ) {
        this.residentId = residentId;
        this.title = title;
        this.description = description;
        this.complaintType = complaintType;
        this.additionalInformation1 = additionalInformation1;
        this.additionalInformation2 = additionalInformation2;
        this.additionalInformation3 = additionalInformation3;
        this.IsAnonymous = isAnonymous;
        this.status = status;
    }
}