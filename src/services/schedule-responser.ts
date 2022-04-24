import { LessonShortName, ScheduleApiClient } from './schedule';
import moment from 'moment';
import { MessengerResponder } from './message-responser';

export class ScheduleResponder extends MessengerResponder {
  private readonly payload: string;

  constructor(payload: string) {
    super();
    this.payload = payload.toUpperCase();
  }

  public async handlePayload() {
    if (this.payload === 'SCHEDULE') {
      return this.genQuickReply('Co dokładnie mam sprawdzić?', [
        { title: 'Ten tydzień', payload: 'SCHEDULE_ACTUAL' },
        { title: 'Kiedy zajęcia', payload: 'SCHEDULE_TERMINAL' },
      ]);
    } else if (this.payload === 'SCHEDULE_ACTUAL') {
      return this.genQuickReply('Która grupa?', [
        { title: 'Pierwsza', payload: 'SCHEDULE_ACTUAL_190201' },
        { title: 'Druga', payload: 'SCHEDULE_ACTUAL_190271' },
      ]);
    } else if (this.payload.includes('SCHEDULE_ACTUAL_')) {
      const groupId = this.payload.replace('SCHEDULE_ACTUAL_', '');
      const scheduleClient = new ScheduleApiClient(groupId);
      const schedule = await scheduleClient.getActualScheduleForGroup();
      const message = schedule
        .map(
          ({ date, day, subject, teacher, room, from }) =>
            `${onlyMonthAndDay(date)} ${day} ${from} ${subject}  ${
              teacher || ''
            } ${generateClass(room)}`,
        )
        .join('\n');
      const firstMessage = this.genTextMessage(
        `W tym tygodniu masz ${schedule.length} zajęć:`,
      );
      const secondMessage = this.genTextMessage(message);
      return [firstMessage, secondMessage];
    } else if (this.payload === 'SCHEDULE_TERMINAL') {
      return this.genQuickReply('Który przedmiot?', this.getLessonButtons());
    } else if (this.payload.includes('SCHEDULE_TERMINAL_')) {
      const lessonShortName = this.payload
        .replace('SCHEDULE_TERMINAL_', '')
        .toLowerCase() as LessonShortName;
      const scheduleClient = new ScheduleApiClient('190201');
      const schedule = await scheduleClient.getLessonsTerminal(lessonShortName);
      return [
        this.genTextMessage(
          `Łącznie ${uppercaseFirstLetter(lessonShortName)} masz ${
            schedule.length
          } zajęć:`,
        ),
        this.genTextMessage(
          schedule
            .map(
              ({ day, date, teacher, room, from }) =>
                `${onlyMonthAndDay(date)} ${day} ${from} ${
                  teacher || ''
                } ${generateClass(room)}`,
            )
            .join('\n'),
        ),
      ];
    }
  }

  protected getLessonButtons() {
    return [
      {
        title: 'Pracownia Programowania',
        payload: 'SCHEDULE_TERMINAL_PRACOWNIA',
      },
      { title: 'Ekonomia', payload: 'SCHEDULE_TERMINAL_EKONOMIA' },
      { title: 'Matematika', payload: 'SCHEDULE_TERMINAL_MATEMATYKA' },
      { title: 'Statystyka', payload: 'SCHEDULE_TERMINAL_STATYSTYKA' },
      { title: 'Dobre praktyki', payload: 'SCHEDULE_TERMINAL_PRAKTYKI' },
      { title: 'Wstep do systemow', payload: 'SCHEDULE_TERMINAL_SYSTEMY' },
      { title: 'Angielski', payload: 'SCHEDULE_TERMINAL_ANGIELSKI' },
    ];
  }
}

function generateClass(str: string | undefined) {
  if (!str) {
    return '';
  }
  if (str.includes('<a href=')) {
    return 'Wykład';
  }
  return str;
}

function uppercaseFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function onlyMonthAndDay(date: string) {
  return moment(date, 'YYYY-MM-DD').format('MM-DD');
}
