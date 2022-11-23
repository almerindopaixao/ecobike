export interface EcoPointDto {
    id: string;
    nome: string;
    logradouro: string;
    bairro: string;
    cidade: string;
    estado: string;
    numero: string | null;
    imagemMd: string;
    imagemSm: string;
    funcionamentoInicio: number;
    functionamentoFim: number;
    latitude: number;
    longitude: number;
}