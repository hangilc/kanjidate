import { KanjiDate } from "./kanjidate";
export declare function format(fmtStr: string, src: KanjiDate | string | Date): string;
export declare const f1 = "{G}{N}\u5E74{M}\u6708{D}\u65E5\uFF08{W}\uFF09";
export declare const f2 = "{G}{N}\u5E74{M}\u6708{D}\u65E5";
export declare const f3 = "{G:a}{N}.{M}.{D}";
export declare const f4 = "{G}{N:2}\u5E74{M:2}\u6708{D:2}\u65E5\uFF08{W}\uFF09";
export declare const f5 = "{G}{N:2}\u5E74{M:2}\u6708{D:2}\u65E5";
export declare const f6 = "{G:a}{N:2}.{M:2}.{D:2}";
export declare const f7 = "{G}{N}\u5E74{M}\u6708{D}\u65E5\uFF08{W}\uFF09 {a}{h:12}\u6642{m}\u5206{s}\u79D2";
export declare const f8 = "{G}{N:2}\u5E74{M:2}\u6708{D:2}\u65E5\uFF08{W}\uFF09 {a}{h:12,2}\u6642{m:2}\u5206{s:2}\u79D2";
export declare const f9 = "{G}{N}\u5E74{M}\u6708{D}\u65E5\uFF08{W}\uFF09 {a}{h:12}\u6642{m}\u5206";
export declare const f10 = "{G}{N:2}\u5E74{M:2}\u6708{D:2}\u65E5\uFF08{W}\uFF09 {a}{h:12,2}\u6642{m:2}\u5206";
export declare const f11 = "{G}{N:z}\u5E74{M:z}\u6708{D:z}\u65E5";
export declare const f12 = "{G}{N:z,2}\u5E74{M:z,2}\u6708{D:z,2}\u65E5";
export declare const f13 = "{Y}-{M:2}-{D:2}";
export declare const f14 = "{Y}-{M:2}-{D:2} {h:2}:{m:2}:{s:2}";
export declare const fSqlDate = "{Y}-{M:2}-{D:2}";
export declare const fSqlDateTime = "{Y}-{M:2}-{D:2} {h:2}:{m:2}:{s:2}";