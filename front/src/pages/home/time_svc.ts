import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import relative from 'dayjs/plugin/relativeTime';

dayjs.extend(utc);
dayjs.extend(relative);
dayjs.extend(duration);

export default dayjs;
