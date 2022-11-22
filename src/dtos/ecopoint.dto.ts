export interface EcoPointDto {
    id: string;
    nome: string;
    logradouro: string;
    bairro: string;
    cidade: string;
    estado: string;
    numero?: string;
    imagem: string;
    funcionamentoInicio: number;
    functionamentoFim: number;
    latitude: number;
    longitude: number;
}