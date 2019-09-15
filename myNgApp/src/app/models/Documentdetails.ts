export class Documentdetails {
    empId: string;
    constructor(
        public _id: string,
        public price: number,
        public extension: string,
        public priority: string,
        public dueTime: number,
        public timeLeft: number,
        public fileName: string,
        public userAccepted: boolean,
        public fileSize: number
    ) {}
}
