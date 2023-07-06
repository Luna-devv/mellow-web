export interface ApiV1TopguildsGetResponse {
    name: string;
    icon: string | null;
    memberCount: number;

    verified: boolean;
    partnered: boolean;
}


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

export interface GuildEmbed {
    title: string | null;
    description: string | null;
    thumbnail: string | null;
    image: string | null;
    color: number;
    footer: {
        text: string | null;
        icon_url: string | null;
    }
}

export interface ApiV1GuildsModulesWelcomeGetResponse {
    enabled: boolean;
    channel?: string;
    webhook?: string;

    message: {
        content?: string;
        embed?: GuildEmbed
    };

    roles: string[];
    pings: string[];
    deleteAfter?: number;
    restore: boolean;

    dm: {
        enabled: boolean;
        message: {
            content?: string;
            embed?: GuildEmbed
        };
    };

    reactions: {
        welcomeMessage: string[],
        firstMessage: string[],
    };

    card: {
        enabled: boolean;
        inEmbed: boolean;
        background?: string;
        textColor?: number;
    }
}

export interface ApiV1MeGetResponse {
    activity: {
        messages: number;
        voiceminutes: number;
        invites: number;
    };
}