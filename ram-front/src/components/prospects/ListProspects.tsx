import { IProspects } from "../../types";
import RowProspect from "../prospects/RowProspect";


export interface IListProspectsProps {
    prospects: IProspects[];
}

export default function ListProspects({ prospects}: IListProspectsProps): JSX.Element {
    if (prospects.length === 0) return <h1>No hay grupos</h1>;

    return (

        <div>

{prospects.map((prospect) => {
        return (
            <RowProspect
            key={prospect.id}
            id={prospect.id}
            name={prospect.name}
            firstSurname={prospect.firstSurname}
            secondSurname={prospect.secondSurname}
            prospectStatus={prospect.prospectStatus}
            />
        );
        })}
        
        </div>

    )

}
