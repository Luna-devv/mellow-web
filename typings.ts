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
    memberCount: number;
    channelCount: number;
    premiumTier: number;
    follownewsChannel?: {
        id?: string;
        name?: string;
    }
}

export interface ApiV1GuildsTopmembersGetResponse {
    id: string;
    globalName: string | null;
    username: string | null;
    avatar: string | null;
    activity: ApiV1MeGetResponse["activity"];
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

interface GuildLeaderboardApp {
    channel: string | null;
    message: string | null;

    type: "daily" | "weekly" | "monthly" | "alltime";
    display: "tag" | "username" | "nickname" | "id";

    background: string | null;
    emoji: string | null;

    cardColor?: number;
    textColor?: number;
}

export interface ApiV1GuildsModulesLeaderboardGetResponse {
    banner: string | null;
    emoji: string | null;

    backgroundColor?: number;
    textColor?: number;
    accentColor?: number;

    messages: GuildLeaderboardApp;
    invites: GuildLeaderboardApp;
    voice: GuildLeaderboardApp;
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
    };
}