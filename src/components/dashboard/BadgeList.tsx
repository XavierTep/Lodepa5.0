
import Badge from "./Badge"



export default function BadgeList({ data }: any) {
  return (
    <div className="flex flex-wrap gap-6 p-6 w-full max-w-[95%] mx-auto justify-start items-start">
      {data.map((measurement: any) => (
        <Badge key={measurement.id} data={measurement} />
      ))}
    </div>
  )
}

