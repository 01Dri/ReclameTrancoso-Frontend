import { CommentDTO } from "./CommentDTO";

export class ManagerAddCommentRequestDTO {
    managerId!: number;
    complaintId!: number;
    comment!: CommentDTO;

    constructor(managerId: number, complaintId: number, comment: CommentDTO) {
        this.managerId = managerId;
        this.complaintId = complaintId;
        this.comment = comment;
    }
}
