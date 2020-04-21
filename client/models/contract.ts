export interface IProduct {
    id: string,
    name: string,
    exportControlled: boolean,
    group: string,
    revision: string
}

export interface IContract {
    id: string,
    state: 'DRAFT' | 'EXPIRED' | 'ACTIVE' | 'BLOCKED',
    validFrom?: string,
    validThrough?: string,
    productCount: number,
    entitledProducts: IProduct[]
}

export interface IContractResponse {
    count: number,
    items: IContract[]
}
