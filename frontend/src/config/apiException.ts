export class ApiException extends Error{
    filter(arg0: (categoria: any) => boolean): import("react").SetStateAction<any[]> {
      throw new Error('Method not implemented.');
    }
    public readonly message: string;

    constructor(mensagem: string){
        super()
        this.message = mensagem
    }
}