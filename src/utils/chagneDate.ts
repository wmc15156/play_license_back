import * as moment from 'moment';

const changeDateFormat = (date) => {
  return moment(date).format('YYYY-MM-DD')
}

export default changeDateFormat;
