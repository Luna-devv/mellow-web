import { Voice } from "@/typings";

export function getVoices(voice?: Voice): string[] {
    const actor = {
        en_us_001: ["en", "us", "Female"],
        en_us_002: ["en", "us", "Female 2"],
        en_us_006: ["en", "us", "Male 1"],
        en_us_007: ["en", "us", "Male 2"],
        en_us_008: ["en", "us", "Male 3"],
        en_us_009: ["en", "us", "Male 4"],
        en_us_010: ["en", "us", "Male 5"],

        en_uk_001: ["en", "uk", "Male 1"],
        en_uk_003: ["en", "uk", "Male 2"],

        en_au_001: ["en", "au", "Female"],
        en_au_002: ["en", "au", "Male"],

        fr_001: ["fr", "fr", "Male 1"],
        fr_002: ["fr", "fr", "Male 2"],

        de_001: ["de", "de", "Female"],
        de_002: ["de", "de", "Male"],

        es_002: ["es", "es", "Male"],
        es_mx_002: ["es", "mx", "Male"],

        br_001: ["pt", "br", "Female 1"],
        br_003: ["pt", "br", "Female 2"],
        br_004: ["pt", "br", "Female 3"],
        br_005: ["pt", "br", "Female 4"],

        id_001: ["id", "id", "Female"],

        jp_001: ["jp", "jp", "Female 1"],
        jp_003: ["jp", "jp", "Female 2"],
        jp_005: ["jp", "jp", "Female 4"],
        jp_006: ["jp", "jp", "Male"],

        kr_003: ["kr", "kr", "Female"],
        kr_002: ["kr", "kr", "Male 1"],
        kr_004: ["kr", "kr", "Male 2"],

        en_us_ghostface: ["en", "scream", "Ghostface"],
        en_us_chewbacca: ["en", "star wars", "Chewbacca "],
        en_us_c3po: ["en", "star wars", "C3PO"],
        en_us_stormtrooper: ["en", "star wars", "Stormtrooper"],
        en_us_stitch: ["en", "lilo, stitch", "Stitch"],
        en_us_rocket: ["en", "GotG", "Rocket"],

        en_female_f08_salut_damour: ["en", "singing", "Alto (Female)"],
        en_female_f08_warmy_breeze: ["en", "singing", "Warmy Breeze (Female)"],
        en_female_ht_f08_glorious: ["en", "singing", "Glorious (Female)"],
        en_female_ht_f08_wonderful_world: ["en", "singing", "Dramatic (Female)"],
        en_male_m03_lobby: ["en", "singing", "Tenor (Male)"],
        en_male_m03_sunshine_soon: ["en", "singing", "Sunshine Soon (Male)"],
        en_male_sing_funny_it_goes_up: ["en", "singing", "Chipmunk (Male)"],
        en_male_m2_xhxs_m03_silly: ["en", "singing", "It Goes Up (Male)"]
    };

    if (!voice) {
        const list: string[] = [];
        for (const key of Object.keys(actor) as Voice[]) list.push(`${actor[key][0].toUpperCase()} (${actor[key][1]}) - ${actor[key][2]}`);
        return list;
    }

    return [`${actor[voice][0].toUpperCase()} (${actor[voice][1]}) - ${actor[voice][2]}`];
}