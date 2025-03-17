
import Badge from "./Badge"



export default function BadgeList({ data, n_sala, rango}: {data:any ; n_sala:string; rango:any}) {
  return (
    <div className="flex flex-wrap gap-6 p-3 w-full max-w-[95%] mx-auto justify-start items-start">
      {data.map((measurement: any) => (
        <Badge key={measurement.id} data={measurement} n_salaBadge={n_sala} rango={rango}/>
      ))}
    </div>
  )
}

