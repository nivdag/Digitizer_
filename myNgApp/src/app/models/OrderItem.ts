export class OrderItem {
    constructor(
        public price: number,
        public srcExtension: string,
        public destExtension: string,
        public priority: string,
        public filename: string
    ) {}
}