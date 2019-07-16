export interface CreateServiceRequestDto {
    readonly name: string;
    readonly phone: string;
    readonly upTime: number;
    readonly serviceableDistance: number;
    readonly isOffline: boolean;
    readonly categoryId: string;
    readonly location: {
        lat: number;
        long: number
    };
}
