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

export const generateGroupUrl = (groupId: string) => `https://planzajec.uek.krakow.pl/index.php?typ=G&id=${groupId}&okres=1`;

export const getScheduleForGroup = async (group: string): Promise<Lesson[]> => {
    const groupApiUrl = generateGroupUrl(group)+'&xml';
    const {data} = await axios.get(groupApiUrl);
    const json = xml2js(data, {compact: true});

    //@ts-ignore
    const schedule = json["plan-zajec"]["zajecia"].map(l => ({
        date: l.termin._text,
        day: l.dzien._text,
        from: l["od-godz"]._text,
        to: l["do-godz"]._text,
        subject: l.przedmiot._text,
        type: l.typ._text,
        teacher: l.nauczyciel._text,
        room: l.sala?._text
    }));
    return getNextLessonsInThisWeek(schedule);
};

const getNextLessonsInThisWeek = (group: Lesson[]) => group.filter(l => {
    const date = moment(l.date, "YYYY-MM-DD");
    const today = moment();
    const isInTheFuture = date.isAfter(today);
    const isInTheSameWeek = date.isSame(today, 'week');
    return isInTheFuture && isInTheSameWeek;
});