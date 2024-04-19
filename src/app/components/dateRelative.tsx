import moment from "moment";

interface DateRelativeProps {
    timeStamp: string;
  }

  // don't' date your grandma thats gross!
  export default function DateRelative(props:DateRelativeProps):JSX.Element {
    const { timeStamp = '' } = props;

    const getDuration = () => {
      let now = moment()
      let created = moment(timeStamp).add(-7, 'hours');
      let duration = moment.duration(created.diff(now));
      return duration.humanize();
    }
  
    return (
      <div className="text-xs text-teal text-center">{getDuration()}</div>
    )
  }