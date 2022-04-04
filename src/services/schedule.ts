import axios from "axios";
import {xml2js} from "xml-js";
import moment from "moment";
import {Lesson} from "../domain/types";

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

moment.updateLocale('en', {
    week: {
        dow: 1 // Monday is the first day of the week.
    }
});

const semester2LessonMap = {
    'pracownia': 'Pracownia programowania II',
    'ekonomia': 'Ekonomia',
    'matematika': 'Analiza matematyczna i algebra liniowa',
    'statystyka': 'Rachunek prawdopodobieństwa i statystyka',
    'praktyki': 'Dobre praktyki tworzenia oprogramowania',
    'systemy': 'Wstęp do systemów informacyjnych',
    'angielski': 'Język obcy 1.2',
} as const;

export type LessonShortName = keyof typeof semester2LessonMap;
export type LessonFullName = 'Pracownia programowania II' | 'Ekonomia' | 'Analiza matematyczna i algebra liniowa' | 'Rachunek prawdopodobieństwa i statystyka' | 'Dobre praktyki tworzenia oprogramowania' | 'Wstęp do systemów informacyjnych' | 'Język obcy 1.2';

export class ScheduleApiClient {
    private readonly baseUrl: string;
    constructor(private readonly groupId: string) {
        this.baseUrl = 'https://planzajec.uek.krakow.pl/index.php'
    }

    private generateScheduleUrl(period: '1' | '2'): string {
        return `${this.baseUrl}?typ=G&id=${this.groupId}&okres=${period}&xml`;
    }

    private async fetchSchedule(uekApiUrl: string) {
        const { data } = await axios.get(uekApiUrl);
        const json = xml2js(data, {compact: true})
        return extractLessons(json);
    }


    public async getActualScheduleForGroup(): Promise<Lesson[]> {
        const lessons = await this.fetchSchedule(this.generateScheduleUrl( '1'));
        return lessons.filter(isInThisWeek);
    }

    public async getLessonsTerminal(lessonName: LessonShortName): Promise<Lesson[]> {
        const lessons = await this.fetchSchedule(this.generateScheduleUrl('2'));
        return lessons.filter(isFutureLesson).filter(isThisLesson(getLessonFullName(lessonName)));
    }


}

function extractLessons(json: any) {
    //@ts-ignore
    return json["plan-zajec"]["zajecia"].map(l => ({
        date: l.termin._text,
        day: l.dzien._text,
        from: l["od-godz"]._text,
        to: l["do-godz"]._text,
        subject: l.przedmiot._text,
        type: l.typ._text,
        teacher: l.nauczyciel._text,
        room: l.sala?._text
    }));
}

function isThisLesson(lessonName: string) {
    return (l: Lesson) => l.subject === lessonName;
}

function isFutureLesson(l: Lesson) {
    const lessonDate = moment(l.date, "YYYY-MM-DD");
    return lessonDate.isAfter(moment());
}

function isInThisWeek(l: Lesson) {
    const lessonDate = moment(l.date, "YYYY-MM-DD");
    return isFutureLesson(l) && lessonDate.isSame(moment(), 'week');
}

function getLessonFullName(key: LessonShortName): LessonFullName {
    return semester2LessonMap[key];
}
