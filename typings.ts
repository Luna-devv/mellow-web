export interface UserGuild {
    id: string;
    name: string;
    icon: string | null;
    owner: boolean;
    permissions: string;
}

export interface RouteErrorResponse {
    statusCode: number;
    message: string;
}

export interface ApiV1GuildsGetResponse {
    id: string;
    name: string;
    icon: string | null;
}

export interface ApiV1GuildsChannelsGetResponse {
    name: string;
    id: string;
    missingPermissions: string[]
}