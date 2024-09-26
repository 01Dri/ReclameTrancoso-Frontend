import { ComplaintStatus } from "../enums/ComplaintStatus";
import { ComplaintType } from "../enums/ComplaintType";
import { CommentDTO } from "./CommentDTO";

export class ComplaintDTO {

    id!: number;
    title!: string;
    description!: string;
    complaintType!: ComplaintType;
    additionalInformation1!: string;
    additionalInformation2!: string;
    additionalInformation3!: string;
    isAnonymous!: boolean;
    status!: ComplaintStatus;
    residentId!: number;
    managerComment!: CommentDTO;

}