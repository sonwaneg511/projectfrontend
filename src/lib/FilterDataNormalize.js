export const formatStartDate = (date) => {
  if (!date) return '';

  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd} 00:00:00`;
};

export const formatEndDate = (date) => {
  if (!date) return '';

  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd} 23:59:59`;
};

const getRepliedValue = ({ replied, notReplied }) => {
  // both selected or none selected → fetch all
  if ((replied && notReplied) || (!replied && !notReplied)) {
    return '';
  }

  if (replied) return 'reply_deployed';
  if (notReplied) return 'no_reply';

  return '';
};

export const buildReviewFilterPayload = ({
  client_id,
  user_id,
  state = '',
  city = '',
  dealer_id = [],
  rating_range = 0,
  rating_type = '',
  repliedFilter = { replied: false, notReplied: false },
  start_date = '',
  end_date = '',
  platform = '',
  page_no = 0,
}) => {
  return {
    client_id,
    user_id,
    state,
    city,
    dealer_id,
    rating_range,
    rating_type,
    replied: getRepliedValue(repliedFilter),
    start_date: start_date ? formatStartDate(start_date) : '',
    end_date: end_date ? formatEndDate(end_date) : '',
    platform,
    page_no,
  };
};
