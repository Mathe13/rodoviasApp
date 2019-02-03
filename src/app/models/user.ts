export class User_data {
    id: number = null
    nome: string = null
    email: string = null
    senha: string = null
    celular: string = null
    editado_em: Date = null
    criado_em: Date = null
    confiança: string = null
    ultimo_acesso: string = null
    // atende: string = null
    constructor(data: object) {
        console.log("dados que vao pro user:", data)
        Object.assign(this, data)
    }
}