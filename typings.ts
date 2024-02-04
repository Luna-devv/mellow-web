export interface ApiV1TopguildsGetResponse {
    name: string;
    icon: string | null;
    memberCount: number;

    verified: boolean;
    partnered: boolean;
}

export interface ApiV1StatisticsGetResponse {
    approximateGuildCount: number;
    guildsGained: number;
    approximateUserCount: number;
    usersGained: number;
    approximateVoteCount: number;
    votesGained: number;
    globalGuilds: number;
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
    banner: string | null;
    memberCount: number;
    premiumTier: number;
    inviteUrl: string | undefined;
    follownewsChannel?: {
        id?: string;
        name?: string;
    };
    ttsChannelId?: string | null;
}

export interface ApiV1GuildsTopmembersGetResponse {
    id: string;
    globalName: string | null;
    username: string | null;
    avatar: string | null;
    activity: ApiV1MeGetResponse["activity"] & { formattedVoicetime: string };
}

export interface ApiV1GuildsTopmembersPaginationGetResponse {
    messages: {
        pages: number;
        total: number;
    };
    voiceminutes: {
        pages: number;
        total: string;
    };
    invites: {
        pages: number;
        total: number;
    };
}

export interface ApiV1GuildsChannelsGetResponse {
    name: string;
    id: string;
    missingPermissions: string[]
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
    webhookURL?: string;

    message: {
        content?: string;
        embed?: GuildEmbed
    };

    roleIds: string[];
    pingIds: string[];
    deleteAfter?: number;
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
    banner: string | null;

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

export type Voice =
    "en_us_001" | "en_us_002" | "en_us_006" | "en_us_007" | "en_us_008" | "en_us_009" | "en_us_010"
    | "en_uk_001" | "en_uk_003"
    | "en_au_001" | "en_au_002"
    | "fr_001" | "fr_002"
    | "de_001" | "de_002"
    | "es_002"
    | "es_mx_002"
    | "br_001" | "br_003" | "br_004" | "br_005"
    | "id_001"
    | "jp_001" | "jp_003" | "jp_005" | "jp_006"
    | "kr_002" | "kr_003" | "kr_004"
    | "en_us_ghostface" | "en_us_chewbacca" | "en_us_c3po" | "en_us_stitch" | "en_us_stormtrooper" | "en_us_rocket"
    | "en_female_f08_salut_damour" | "en_male_m03_lobby" | "en_male_m03_sunshine_soon" | "en_female_f08_warmy_breeze" | "en_female_ht_f08_glorious" | "en_male_sing_funny_it_goes_up" | "en_male_m2_xhxs_m03_silly" | "en_female_ht_f08_wonderful_world"

export interface ApiV1MeGetResponse {
    rank?: {
        background?: string | null;
        textColor?: number;
        barColor?: number;
        useLeaderboardList?: boolean;
        subText?: {
            type: 0 | 1 | 2 | 3 // 0: off, 1: date, 2: relative, 3: custom
            content?: string;
        };
    };
    tts?: {
        defaultVoice?: Voice;
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
    tagId: string;
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
    timeout: number;

    whitelistChannelIds: string[];
    whitelistRoleIds: string[];
}

export interface ApiV1AiResponse {
    title: string;
    url: string;
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