import { actor } from "./utils/tts";

export interface ApiError {
    statusCode: number;
    message: string;
}

export interface ApiV1TopguildsGetResponse {
    id: string;
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
}

export interface RouteErrorResponse {
    statusCode: number;
    message: string;
}

export interface ApiV1GuildsGetResponse {
    id: string;
    name: string;
    icon: string | null;
    banner: string | null;
    memberCount: number;
    premiumTier: number;
    inviteUrl: string | undefined;
    description: string | null;
    follownewsChannel?: {
        id?: string;
        name?: string;
    };
    tts: {
        channelId: string | null;
        announceUser: boolean;
        logChannelId: string | null;
        priorityRoleId: string | null;
        maxLength?: number | null;
        queue: boolean | null;
    };
    embedLinks: boolean;
}

export interface ApiV1GuildsTopmembersGetResponse {
    id: string;
    username: string | null;
    globalName: string | null;
    avatar: string | null;
    bot: true;
    emoji: string | null;
    activity: ApiV1UsersMeGetResponse["activity"] & { formattedVoicetime: string };
}

export interface ApiV1GuildsTopmembersPaginationGetResponse {
    messages: {
        pages: number;
        total: number;
    };
    voiceminutes: {
        pages: number;
        total: string;
        formattedTotal: string;
    };
    invites: {
        pages: number;
        total: number;
    };
}

export interface ApiV1GuildsChannelsGetResponse {
    name: string;
    id: string;
    missingPermissions: string[];
}

export interface ApiV1GuildsRolesGetResponse {
    name: string;
    id: string;
    missingPermissions: string[];
    position: number;
    color: number;
}

export interface ApiV1GuildsEmojisGetResponse {
    name: string;
    id: string;
    animated: boolean;
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
    channelId?: string;

    message: {
        content?: string;
        embed?: GuildEmbed
    };

    roleIds: string[];
    pingIds: string[];
    deleteAfter?: number;
    deleteAfterLeave?: boolean;
    restore: boolean;

    dm: {
        enabled: boolean;
        message: {
            content?: string;
            embed?: GuildEmbed;
        };
    };

    reactions: {
        welcomeMessageEmojis: string[],
        firstMessageEmojis: string[],
    };

    card: {
        enabled: boolean;
        inEmbed: boolean;
        background?: string;
        textColor?: number;
    };

    button: {
        enabled: boolean;
        style: 1 | 2 | 3 | 4;
        emoji?: string | null;
        label?: string | null;
        ping?: boolean;
        type: 0;
    };
}

export interface ApiV1GuildsModulesByeGetResponse {
    enabled: boolean;
    channelId?: string;
    webhookURL?: string;

    message: {
        content?: string;
        embed?: GuildEmbed
    };

    deleteAfter?: number;

    card: {
        enabled: boolean;
        inEmbed: boolean;
        background?: string;
        textColor?: number;
    };
}

export interface ApiV1GuildsModulesStarboardGetResponse {
    enabled: boolean;
    channelId?: string;
    emoji: string;
    requiredEmojis: number;
    embedColor: number;
    style: number;

    allowNSFW: boolean;
    allowBots: boolean;
    allowEdits: boolean;
    allowSelfReact: boolean;
    displayReference: boolean;

    blacklistRoleIds: string[];
    blacklistChannelIds: string[];
    delete: boolean;
}

export interface ApiV1GuildsModulesLeaderboardUpdatingPostResponse {
    leaderboardId: string;
    guildId: string;

    channelId: string;
    messageId: string;

    type: "messages" | "voiceminutes" | "invites";

    /**
     * 0 - text based
     * 1 - image grid
     * 2 - image list
     */
    structure: number;
    styles: {
        useQuotes: boolean;
        rank: "**" | "__" | "*" | "`" | null;
        number: "**" | "__" | "*" | "`" | null;
        user: "**" | "__" | "*" | "`" | null;
    }

    range: "daily" | "weekly" | "monthly" | "alltime";
    display: "tag" | "username" | "nickname" | "id";

    background: string | null;
    emoji: string | null;

    updatedAt: string;
    createdAt: string;
}

export interface ApiV1GuildsModulesLeaderboardGetResponse {
    bannerUrl: string | null;

    backgroundColor: number | null;
    textColor: number | null;
    accentColor: number | null;

    blacklistChannelIds: string[];

    roles: {
        messages: string[];
        voiceminutes: string[];
        // invites: string[]; // again'st tos
    } | undefined;

    updating: ApiV1GuildsModulesLeaderboardUpdatingPostResponse[];
}

export interface ApiV1GuildsModulesPassportGetResponse {
    enabled: boolean;
    channelId?: string;
    /**
     * We're currently on free tier
     */
    captchaType: "slide" | "word" | "icon" | "match" | "winlinze" | "nine" | "random";
    /**
     * 0 - Ban
     * 1 - Kick
     * 2 - Assign role
     */
    punishment: 0 | 1 | 2;
    punishmentRoleId?: string;

    successRoleId?: string;
    unverifiedRoleId?: string;

    sendFailedDm: boolean;
    alsoFailIf: ("disposableEmailAddress")[]

    backgroundColor?: number;
    textColor?: number;
    accentColor?: number;
}

export interface ApiV1UsersMeGetResponse {
    voteCount?: number;

    rank?: {
        background?: string | null;
        emoji?: string | null;
        textColor?: number;
        barColor?: number;
        useLeaderboardList?: boolean;
        subText?: {
            type: 0 | 1 | 2 | 3 // 0: off, 1: date, 2: relative, 3: custom
            content?: string;
        };
    };
    tts?: {
        defaultVoice?: keyof typeof actor;
        defaultFiletype?: "ogg" | "wav" | "mp3";
        commandUses?: number;
    };
    activity?: {
        messages: number;
        voiceminutes: number;
        invites: number;
        formattedVoicetime: string;
    };
}

export interface ApiV1UsersMeConnectionsSpotifyGetResponse {
    displayName: string;
    avatar: string | null;
    playing: {
        name: string;
        id: string;
        artists: string;
        duration: string;
    } | undefined;
}

export interface ApiV1GuildsModulesTagsGetResponse {
    id: string;
    guildId: string;
    applicationCommandId?: string;

    name: string;
    permission: string | null;
    aliases: string[];

    message: {
        content: string | null;
        embed?: GuildEmbed;
    };

    authorId: string;

    createdAt: Date;
}

export interface ApiV1GuildsModulesEmbedmessagelinksGetResponse {
    enabled: boolean;
    color?: number | null;
    display: 0 | 1 | 2;
}

export interface ApiV1GuildsModulesNsfwModerationGetResponse {
    enabled: boolean;
    logChannelId: string | null;
    /**
     * @example
     * 0 - Nothing
     * 1 - Ban
     * 2 - Kick
     * 3 - Delete message
     */
    punishment: 0 | 1 | 2 | 3;
    threshold: number;

    whitelistChannelIds: string[];
    whitelistRoleIds: string[];
}

export interface Upload {
    id: string;
    guildId?: string | null;
    authorId: string;

    prompt: string;
    negativePrompt?: string | null;
    model: string;

    verified: boolean;
    nsfw: boolean;

    createdAt: string;
}

export interface ApiV1UploadsGetResponse {
    results: Upload[];
    pagination: {
        total: number;
        pages: number;
    }
}

export interface ApiV1UploadGetResponse extends Upload {
    author: {
        username: string;
        globalName: string;
        avatar: string | null;
        bot?: boolean;
    };
}

export interface ApiV1UsersGetResponse {
    id: string;
    username: string;
    globalName: string | null;
    avatar: string | null;

    bannerUrl: string | null;
    voteCount: number;
    likeCount: number;

    activity: Required<ApiV1UsersMeGetResponse>["activity"];
    guilds: {
        guildId: string;
        activity: Required<ApiV1UsersMeGetResponse>["activity"];
    }[];
}

export interface ApiV1GuildsModulesNotificationsGetResponse {
    id: string;
    guildId: string;
    channelId: string;
    roleId: string | null;

    type: 0;
    creatorId: string;

    message: {
        content: string | null;
        embed?: GuildEmbed;
    };

    createdAt: Date;

    creator: {
        id: string;
        username: string;
        customUrl: string;
        avatarUrl: string;
        subs: string;
        videos: string;
        views: string;
    }

}
export interface ApiV1UsersMeRankEmojiPutResponse {
    id: string;
    url: string;
}

export interface ApiV1UsersMeRankEmojiDeleteResponse {
    id: null;
    url: null;
}

export interface PronounsResponse {
    status: number;
    content: string[];
}

export interface NekosticResponse {
    event: string;
    name: string;
    uses: number
    users: number;
    snapshot: string;
}