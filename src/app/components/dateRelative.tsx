import moment from "moment";

const HRS_OFFSET = process.env.NEXT_PUBLIC_HRS_OFFSET || 0;

interface DateRelativeProps {
    timeStamp: string;
  }

  // don't' date your grandma thats gross!
  export default function DateRelative(props:DateRelativeProps):JSX.Element {
    const { timeStamp = '' } = props;

    const getDuration = () => {
      let now = moment();
      let created = moment(timeStamp).add(+HRS_OFFSET, 'hours');
      let duration = moment.duration(created.diff(now));
      return duration.humanize();
    }
  
    return (
      <div className="text-xs text-teal text-center">{getDuration()}</div>
    )
  }