import jsonData from './data.json';

// Data grabbed from https://developer.garmin.com/17a0495e5f018b91d4f2ea6b61e63f3ae7df3c39-70b37eec29b194cb7c4a.js

export enum ScreenShape {
    Round,
    SemiRound,
    SemiOctagon,
    Rectangle,
    Other
}

export enum ScreenTech {
    Mip8,
    Mip16,
    Mip64,
    Amoled,
    TrMono,
    TrHiColor,
    Other
}

export interface DeviceData {
    name: string;
    category: string;
    imgUrl: string;
    buyUrl: string;
    resolution: number[];
    shape: ScreenShape;
    tech: ScreenTech;
    features: string[];
    systemLevel: string;
    version: string;
    partNumber: string;
}

export class DataLoader {
    private static featureList: any;

    private static basicFeatures = {
        watchFace: "Watch face",
        watchApp: "Watch application",
        widget: "Widgets",
        datafield: "Data fields",
        background: "Backgrounds",
        audioContentProvider: "Audio content providers",
    } 

    public static getFeatureList():any {
        return this.featureList;
    }

    public static load(): DeviceData[] {
        const data = [] as DeviceData[];
        for (const cat of jsonData.deviceList) {
            for (const d of cat.devices) {
                data.push({
                    name: d.display ?? "Unknown device",
                    category: cat.display,
                    imgUrl: d.imageURL ?? "",
                    buyUrl: d.buyDeviceURL ?? "",
                    resolution: [d.screenResolution.width, d.screenResolution.height],
                    shape: DataLoader.MapShape(d.screenShape),
                    tech: DataLoader.MapTech(d.displayTechnology),
                    features: DataLoader.MapFeatures(d.features, d.additionalFeatures),
                    systemLevel: d.systemLevel,
                    version: d.versionCompatibility,
                    partNumber: this.ExtractPartNumber(d.imageURL)
                });
            }
        }
        const features = data.flatMap(d => d.features);
        this.featureList = {};
        // function mf(ff: string) {console.log(`Missing feature: ${ff}`); return ff};
        for( const f of features.sort()){
            if (this.featureList[f] == undefined) {
                this.featureList[f] = f
                    // ((jsonData.featureList as any)[f] as string | undefined) ?? 
                    // ((this.basicFeatures as any)[f] as string | undefined) ?? 
                    // mf(f);
            }
        }

        return data;
    }

    private static ExtractPartNumber(url: string): string {
        // 010-02403-03
        const m = /\/([0-9]{3}-[0-9]{5}-[0-9]{2})\//g.exec(url);
        return m == null ? "" : m[1];
    }

    private static MapShape(s: string): ScreenShape {
        switch (s) {
            case 'round':
                return ScreenShape.Round;
            case 'semi-round':
                return ScreenShape.SemiRound;
            case 'semi-octagon':
                return ScreenShape.SemiOctagon;
            case 'rectangle':
                return ScreenShape.Rectangle;
            default: 
                console.log(`unknown screen shape: ${s}`);
                return ScreenShape.Other;
        }
    }

    private static MapFeatures(f: string[], af: string[]): string[] {
        return f.concat(af).sort();
    }

    private static MapTech(t: string | undefined): ScreenTech {
        if (t == undefined) return ScreenTech.Other;

        switch(t){
            case "Memory-In-Pixel (64 colors)": return ScreenTech.Mip64;
            case "AMOLED": return ScreenTech.Amoled;
            case "Transflective Liquid-Crystal (High Color)": return ScreenTech.TrHiColor;
            case "Transflective Liquid-Crystal (Single Color)": return ScreenTech.TrMono;
            case "Memory-In-Pixel (16 colors)": return ScreenTech.Mip16;
            case "Memory-In-Pixel (8 colors)": return ScreenTech.Mip8;
            default: console.log(`unknown display tech: ${t}`); return ScreenTech.Other;
        }
    }
}

export class Formatter {
    public static FormatShape(s: ScreenShape): string {
        switch (s){
            case ScreenShape.Rectangle: return "Rectangle";
            case ScreenShape.Round: return "Round";
            case ScreenShape.SemiRound: return "Semi-round";
            case ScreenShape.SemiOctagon: return "Semi-octagon";
            default:
            case ScreenShape.Other: return "Other";
        }
    }
    public static FormatTech(s: ScreenTech): string {
        switch (s){
            case ScreenTech.Mip8:
            case ScreenTech.Mip16:
            case ScreenTech.Mip64: return "Memory-in-pixel";
            case ScreenTech.TrMono:
            case ScreenTech.TrHiColor: return "Transflective LCD";
            case ScreenTech.Amoled: return "AMOLED";
            default:
            case ScreenTech.Other: return "Other";
        }
    }
    public static FormatColorCount(s: ScreenTech): number {
        switch (s){
            case ScreenTech.Mip8: return 8;
            case ScreenTech.Mip16: return 16;
            case ScreenTech.Mip64: return 64;
            case ScreenTech.TrMono: return 2;
            case ScreenTech.TrHiColor: return 65536;
            case ScreenTech.Amoled: return 65536;
            default:
            case ScreenTech.Other: return -1;
        }
    }
}