import type { ChannelType } from "discord-api-types/v10";

import type { actor } from "./utils/tts";

export interface ApiError {
    status: number;
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

export interface ApiV1UsersMeGuildsGetResponse {
    id: string;
    name: string;
    icon: string | null;
    bot: boolean;
}

export enum GuildFlags {
    Premium = 1 << 0,
    PrivateLeaderboard = 1 << 1,
    EmbedDiscordLinks = 1 << 2,

    WelcomeEnabled = 1 << 4,
    FarewellEnabled = 1 << 5,
    StarboardEnabled = 1 << 6,
    PassportEnabled = 1 << 7,

    TextToSpeechAnnounceUsers = 1 << 8,
    TextToSpeechQueueMessages = 1 << 9,
    TextToSpeechAllowBots = 1 << 10,

    WelcomeRestore = 1 << 11,
    WelcomeDirectMessage = 1 << 12,
    WelcomeCard = 1 << 13,
    WelcomeCardInEmbed = 1 << 14,
    WelcomeButton = 1 << 15,
    WelcomeButtonPing = 1 << 16,

    FarewellCard = 1 << 17,
    FarewellCardInEmbed = 1 << 18,

    StarboardAllowNSFW = 1 << 19,
    StarboardAllowBots = 1 << 20,
    StarboardAllowEdits = 1 << 21,
    StarboardAllowSelf = 1 << 22,
    StarboardDisplayReference = 1 << 23,
    StarboardDeleteOnLoss = 1 << 24
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
        id: string;
        name: string;
    };
    tts: {
        channelId: string | null;
        logChannelId: string | null;
        blacklistRoleId: string | null;
        priorityRoleId: string | null;
        maxLength: number | null;
    };
    flags: GuildFlags;
    style: {
        username: string | null;
        avatar: string | null;
        banner: string | null;
    };
}

export interface ApiV1GuildsStylePatchResponse {
    username: string | null;
    avatar: string | null;
    banner: string | null;
    bio: string | null;
}

export interface ApiV1GuildsTopmembersGetResponse {
    id: string;
    username: string | null;
    globalName: string | null;
    avatar: string | null;
    bot: true;
    emoji: string | null;
    activity: ApiV1UsersMeGetResponse["activity"] & {
        formattedVoicetime: string;
    };
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
    type: ChannelType;
    name: string;
    id: string;
    /**
     * @description permission bitfield for the bot in the channel
     */
    permissions: number;
    nsfw: boolean;
}

export interface ApiV1GuildsRolesGetResponse {
    name: string;
    id: string;
    /**
     * @description -1 represents the role being above the bot's highest role
     */
    permissions: -1 | 0;
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
    };
}

export interface ApiV1GuildsModulesWelcomeGetResponse {
    channelId: string | null;

    message: {
        content?: string;
        embed?: GuildEmbed;
    };

    roleIds: string[];
    pingIds: string[];
    deleteAfter?: number;
    deleteAfterLeave?: boolean;

    dm: {
        message: {
            content?: string;
            embed?: GuildEmbed;
        };
    };

    reactions: {
        welcomeMessageEmojis: string[];
        firstMessageEmojis: string[];
    };

    card: {
        background?: string;
    };

    button: {
        style: 1 | 2 | 3 | 4;
        emoji?: string | null;
        label?: string | null;
        type: 0;
    };
}

export interface ApiV1GuildsModulesByeGetResponse {
    channelId: string | null;

    message: {
        content?: string;
        embed?: GuildEmbed;
    };

    deleteAfter?: number;

    card: {
        background?: string;
    };
}

export enum StarboardStyle {
    Username = 0,
    GlobalName = 1,
    Nickname = 2,
    NicknameAndGuildAvatar = 3,
    Anonymous = 4
}

export interface ApiV1GuildsModulesStarboardGetResponse {
    channelId?: string;
    emoji: string;
    requiredEmojis: number;
    embedColor: number;
    style: StarboardStyle;

    blacklistRoleIds: string[];
    blacklistChannelIds: string[];
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
    };

    range: "daily" | "weekly" | "monthly" | "alltime";
    display: "mention" | "username" | "nickname" | "id";

    background: string | null;
    emoji: string | null;

    updatedAt: string;
    createdAt: string;
}

export interface ApiV1GuildsModulesLeaderboardGetResponse {
    bannerUrl: string | null;

    blacklistChannelIds: string[];

    roles:
    | {
        messages: string[];
        voiceminutes: string[];
    }
    | undefined;

    updating: ApiV1GuildsModulesLeaderboardUpdatingPostResponse[];
}

export interface ApiV1GuildsModulesPassportGetResponse {
    channelId: string | null;
    /**
     * 0 - Ban
     * 1 - Kick
     * 2 - Assign role
     */
    punishment: 0 | 1 | 2;
    punishmentRoleId: string | null;

    successRoleId: string | null;
    unverifiedRoleId: string | null;
}

export enum UserFlags {
    Premium = 1 << 0,
    ChatToSpeechIgnore = 1 << 4,
    LeaderboardAlternateStyle = 1 << 5
}

export interface ApiV1UsersMeGetResponse {
    flags: UserFlags;
    voteCount?: number;
    rank?: {
        background?: string | null;
        emoji?: string | null;
        textColor?: number;
        barColor?: number;
        subText?: {
            type: 0 | 1 | 2 | 3; // 0: off, 1: date, 2: relative, 3: custom
            content?: string;
        };
    };
    voice?: keyof typeof actor;
    activity?: {
        messages: number;
        voiceminutes: number;
        invites: number;
        formattedVoicetime: string;
    };
}

export enum ConnectionType {
    Spotify = 0,
    Bluesky = 1
}

export interface ApiV1UsersMeConnectionsGetResponse {
    username: string;
    avatar: string | null;
    type: ConnectionType;
}

export interface ApiV1UsersMeBillingGetResponse {
    subscriptionId: string;
    status:
    | "active"
    | "canceled"
    | "incomplete"
    | "incomplete_expired"
    | "past_due"
    | "paused"
    | "trialing"
    | "unpaid";
    priceId: string;
    created: number;
    currentPeriodEnd: number;
    currentPeriodStart: number;
    cancelAtPeriodEnd: boolean;
    donationQuantity: number;
    paymentMethod:
    | {
        brand: string | null;
        last4: string | null;
    }
    | string
    | null;
    portalUrl: string;
    guildIds: string[];
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

export enum AutomodType {
    BlockServerInvites = "server_invites",
    BlockBotInvites = "bot_invites",
    BlockTwitter = "twitter"
}

export interface ApiV1GuildsModulesAutomodGetResponse {
    status: Record<AutomodType, boolean>;
    whitelistChannelIds: string[];
    whitelistRoleIds: string[];
    keywordFilter: string[];
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

export enum NotificationType {
    YouTube = 0,
    Twitch = 1,
    Bluesky = 2,
    Reddit = 3
}

export enum BlueskyNotificationFlags {
    SendReposts = 1 << 0,
    SendReplies = 1 << 1,
    SendQuotes = 1 << 2,
    MustContainImage = 1 << 3
}

export enum TwitchNotificationFlags {
    DeleteAfterStream = 1 << 4
}

export enum YoutubeNotificationFlags {
    SendVideos = 1 << 5,
    SendShorts = 1 << 6
}

export interface ApiV1GuildsModulesNotificationsGetResponse {
    id: string;
    guildId: string;
    channelId: string;
    roleId: string | null;

    type: NotificationType;
    flags: BlueskyNotificationFlags | YoutubeNotificationFlags;
    regex: string | null;

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
        avatarUrl: string | null;
    };

    username: string | null;
    avatar: string | null;
}

export interface ApiV1GuildsModulesNotificationStylePatchResponse {
    username: string;
    avatar: string | null;
}

export enum DailypostType {
    Anime = 1,
    Blahaj = 2,
    NekosBest = 3
}

export interface ApiV1GuildsModulesDailypostsGetResponse {
    id: string;
    guildId: string;
    channelId: string;
    roleId: string | null;

    runtimeHours: `${number}`[];

    type: DailypostType;
    query: string | null;
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
    uses: number;
    users: number;
    snapshot: string;
}

export enum PermissionFlagsBits {
    CreateInstantInvite = 0x00_00_00_00_00_00_00_01,
    KickMembers = 0x00_00_00_00_00_00_00_02,
    BanMembers = 0x00_00_00_00_00_00_00_04,
    Administrator = 0x00_00_00_00_00_00_00_08,
    ManageChannels = 0x00_00_00_00_00_00_00_10,
    ManageGuild = 0x00_00_00_00_00_00_00_20,
    AddReactions = 0x00_00_00_00_00_00_00_40,
    ViewAuditLog = 0x00_00_00_00_00_00_00_80,
    PrioritySpeaker = 0x00_00_00_00_00_00_01_00,
    Stream = 0x00_00_00_00_00_00_02_00,
    ViewChannel = 0x00_00_00_00_00_00_04_00,
    SendMessages = 0x00_00_00_00_00_00_08_00,
    SendTtsMessages = 0x00_00_00_00_00_00_10_00,
    ManageMessages = 0x00_00_00_00_00_00_20_00,
    EmbedLinks = 0x00_00_00_00_00_00_40_00,
    AttachFiles = 0x00_00_00_00_00_00_80_00,
    ReadMessageHistory = 0x00_00_00_00_00_01_00_00,
    MentionEveryone = 0x00_00_00_00_00_02_00_00,
    UseExternalEmojis = 0x00_00_00_00_00_04_00_00,
    ViewGuildInsights = 0x00_00_00_00_00_08_00_00,
    Connect = 0x00_00_00_00_00_10_00_00,
    Speak = 0x00_00_00_00_00_20_00_00,
    MuteMembers = 0x00_00_00_00_00_40_00_00,
    DeafenMembers = 0x00_00_00_00_00_80_00_00,
    MoveMembers = 0x00_00_00_00_01_00_00_00,
    UseVad = 0x00_00_00_00_02_00_00_00,
    ChangeNickname = 0x00_00_00_00_04_00_00_00,
    ManageNicknames = 0x00_00_00_00_08_00_00_00,
    ManageRoles = 0x00_00_00_00_10_00_00_00,
    ManageWebhooks = 0x00_00_00_00_20_00_00_00,
    ManageGuildExpressions = 0x00_00_00_00_40_00_00_00,
    UseApplicationCommands = 0x00_00_00_00_80_00_00_00,
    RequestToSpeak = 0x00_00_00_01_00_00_00_00,
    ManageEvents = 0x00_00_00_02_00_00_00_00,
    ManageThreads = 0x00_00_00_04_00_00_00_00,
    CreatePublicThreads = 0x00_00_00_08_00_00_00_00,
    CreatePrivateThreads = 0x00_00_00_10_00_00_00_00,
    UseExternalStickers = 0x00_00_00_20_00_00_00_00,
    SendMessagesInThreads = 0x00_00_00_40_00_00_00_00,
    UseEmbeddedActivities = 0x00_00_00_80_00_00_00_00,
    ModerateMembers = 0x00_00_01_00_00_00_00_00,
    ViewCreatorMonetizationAnalytics = 0x00_00_02_00_00_00_00_00,
    UseSoundboard = 0x00_00_04_00_00_00_00_00,
    CreateGuildExpressions = 0x00_00_08_00_00_00_00_00,
    CreateEvents = 0x00_00_10_00_00_00_00_00,
    UseExternalSounds = 0x00_00_20_00_00_00_00_00,
    SendVoiceMessages = 0x00_00_40_00_00_00_00_00,
    SendPolls = 0x00_02_00_00_00_00_00_00,
    UseExternalApps = 0x00_04_00_00_00_00_00_00
}