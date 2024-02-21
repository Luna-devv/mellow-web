export const actor = {
    en_us_001: ["English", "us", "Female"],
    en_us_002: ["English", "us", "Female 2"],
    en_us_006: ["English", "us", "Male 1"],
    en_us_007: ["English", "us", "Male 2"],
    en_us_008: ["English", "us", "Male 3"],
    en_us_009: ["English", "us", "Male 4"],
    en_us_010: ["English", "us", "Male 5"],

    en_uk_001: ["English", "uk", "Male 1"],
    en_uk_003: ["English", "uk", "Male 2"],

    en_au_001: ["English", "au", "Female"],
    en_au_002: ["English", "au", "Male"],

    fr_001: ["French", "fr", "Male 1"],
    fr_002: ["French", "fr", "Male 2"],

    de_001: ["German", "de", "Female"],
    de_002: ["German", "de", "Male"],

    es_002: ["Spanish", "es", "Male"],
    es_mx_002: ["Spanish", "mx", "Male"],

    br_001: ["Portuguese", "br", "Female 1"],
    br_003: ["Portuguese", "br", "Female 2"],
    br_004: ["Portuguese", "br", "Female 3"],
    br_005: ["Portuguese", "br", "Female 4"],

    id_001: ["Indonesian", "id", "Female"],

    jp_001: ["Japanese", "jp", "Female 1"],
    jp_003: ["Japanese", "jp", "Female 2"],
    jp_005: ["Japanese", "jp", "Female 4"],
    jp_006: ["Japanese", "jp", "Male"],

    kr_003: ["Korean", "kr", "Female"],
    kr_002: ["Korean", "kr", "Male 1"],
    kr_004: ["Korean", "kr", "Male 2"],

    en_us_ghostface: ["English", "scream", "Ghostface"],
    en_us_chewbacca: ["English", "star wars", "Chewbacca"],
    en_us_c3po: ["English", "star wars", "C3PO"],
    en_us_stormtrooper: ["English", "star wars", "Stormtrooper"],
    en_us_stitch: ["English", "lilo, stitch", "Stitch"],
    en_us_rocket: ["English", "GotG", "Rocket"],

    en_female_f08_salut_damour: ["English", "singing", "Alto (Female)"],
    en_female_f08_warmy_breeze: ["English", "singing", "Warmy Breeze (Female)"],
    en_female_ht_f08_glorious: ["English", "singing", "Glorious (Female)"],
    en_female_ht_f08_wonderful_world: ["English", "singing", "Dramatic (Female)"],
    en_male_m03_lobby: ["English", "singing", "Tenor (Male)"],
    en_male_m03_sunshine_soon: ["English", "singing", "Sunshine Soon (Male)"],
    en_male_sing_funny_it_goes_up: ["English", "singing", "Chipmunk (Male)"],
    en_male_m2_xhxs_m03_silly: ["English", "singing", "It Goes Up (Male)"]
} as const;

export const voices = Object.keys(actor) as (keyof typeof actor)[];

export function getVoices(voice?: keyof typeof actor): string[] {
    if (!voice) {
        const list: string[] = [];
        for (const key of voices) list.push(`${actor[key][0]} (${actor[key][1]}) - ${actor[key][2]}`);
        return list;
    }

    return [`${actor[voice][0]} (${actor[voice][1]}) - ${actor[voice][2]}`];
}