export type AddressType = {
    id: number,
    receiver: string,
    street: string,
    number: string,
    complement?: string,
    neighborhood: string,
    city: string,
    state: string,
    zipCode: string,
    isDefault: boolean
}